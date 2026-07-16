import { getDatabasePool } from "../config/database.js";
import { getEmbeddingModel } from "../config/ai.js";
import {
  createClauseEmbeddingsInBatches,
  serializePgVector,
} from "./embeddings.js";
import {
  calculateOverallRiskScore,
  classifyClauseRisk,
} from "./riskScoring.js";
import { SegmentationError, segmentContractText } from "./segmentation.js";

export class DocumentAnalysisError extends Error {
  constructor(message, { cause, documentId } = {}) {
    super(message, { cause });
    this.name = "DocumentAnalysisError";
    this.documentId = documentId;
  }
}

function getPublicAnalysisError(error) {
  if (error instanceof SegmentationError) {
    return error.message;
  }

  if (/embedding|Gemini|baseline/i.test(error?.message ?? "")) {
    return "The AI analysis service could not process this contract. Please retry.";
  }

  return "Contract analysis failed. Please retry.";
}

async function findClosestBaseline(
  connection,
  { category, embedding, embeddingModel },
) {
  const result = await connection.query(
    `
      SELECT
        id,
        clause_text AS "clauseText",
        1 - (embedding <=> $1::vector) AS similarity
      FROM baseline_clauses
      WHERE category = $2
        AND embedding IS NOT NULL
        AND embedding_model = $3
      ORDER BY embedding <=> $1::vector
      LIMIT 1
    `,
    [serializePgVector(embedding), category, embeddingModel],
  );
  const match = result.rows[0];

  if (!match) {
    return null;
  }

  return {
    id: match.id,
    clauseText: match.clauseText,
    similarity: Number(match.similarity),
  };
}

async function storeAnalyzedClauses(
  connection,
  { documentId, embeddingModel, embeddings, segmentedClauses },
) {
  const analyzedClauses = [];

  await connection.query("DELETE FROM clauses WHERE document_id = $1", [documentId]);

  for (let index = 0; index < segmentedClauses.length; index += 1) {
    const clause = segmentedClauses[index];
    const embedding = embeddings[index];
    const closestBaseline = await findClosestBaseline(connection, {
      category: clause.category,
      embedding,
      embeddingModel,
    });
    const riskLabel = classifyClauseRisk({
      category: clause.category,
      clauseText: clause.clauseText,
      similarity: closestBaseline?.similarity,
    });
    const insertClauseResult = await connection.query(
      `
        INSERT INTO clauses (
          document_id,
          clause_text,
          category,
          risk_label,
          explanation,
          order_index,
          closest_baseline_clause_id,
          similarity_score
        )
        VALUES ($1, $2, $3, $4, NULL, $5, $6, $7)
        RETURNING id
      `,
      [
        documentId,
        clause.clauseText,
        clause.category,
        riskLabel,
        clause.orderIndex,
        closestBaseline?.id ?? null,
        closestBaseline?.similarity ?? null,
      ],
    );
    const clauseId = insertClauseResult.rows[0].id;

    await connection.query(
      `
        INSERT INTO clause_embeddings (clause_id, embedding, embedding_model)
        VALUES ($1, $2::vector, $3)
      `,
      [clauseId, serializePgVector(embedding), embeddingModel],
    );

    analyzedClauses.push({
      ...clause,
      id: clauseId,
      riskLabel,
      similarity: closestBaseline?.similarity ?? null,
      closestBaseline,
    });
  }

  return analyzedClauses;
}

export async function analyzeDocument(
  documentId,
  originalText,
  {
    database = getDatabasePool(),
    embedClauses = createClauseEmbeddingsInBatches,
    embeddingModel = getEmbeddingModel(),
    segmentText = segmentContractText,
  } = {},
) {
  let connection;
  let transactionStarted = false;

  try {
    const segmentedClauses = await segmentText(originalText);
    const embedded = await embedClauses(segmentedClauses, {
      model: embeddingModel,
    });

    if (embedded.embeddings.length !== segmentedClauses.length) {
      throw new Error("Embedding count does not match the segmented clause count");
    }

    connection = await database.connect();
    await connection.query("BEGIN");
    transactionStarted = true;

    const analyzedClauses = await storeAnalyzedClauses(connection, {
      documentId,
      embeddingModel,
      embeddings: embedded.embeddings,
      segmentedClauses,
    });
    const overallRiskScore = calculateOverallRiskScore(
      analyzedClauses.map((clause) => clause.riskLabel),
    );

    await connection.query(
      `
        UPDATE documents
        SET status = 'complete', overall_risk_score = $1, analysis_error = NULL
        WHERE id = $2
      `,
      [overallRiskScore, documentId],
    );
    await connection.query("COMMIT");
    transactionStarted = false;

    return { clauses: analyzedClauses, overallRiskScore };
  } catch (error) {
    if (connection && transactionStarted) {
      await connection.query("ROLLBACK").catch(() => undefined);
    }

    const publicMessage = getPublicAnalysisError(error);
    await database
      .query(
        `
          UPDATE documents
          SET status = 'failed', analysis_error = $1
          WHERE id = $2
        `,
        [publicMessage, documentId],
      )
      .catch((statusError) => {
        console.error("Failed to mark document analysis as failed", statusError);
      });

    throw new DocumentAnalysisError(publicMessage, {
      cause: error,
      documentId,
    });
  } finally {
    connection?.release();
  }
}

export function enqueueDocumentAnalysis(documentId, originalText, options) {
  // An in-process background task is enough for the single-instance MVP and
  // keeps the upload response non-blocking. A durable queue is a deployment
  // hardening step if the API later runs on multiple instances.
  setImmediate(() => {
    analyzeDocument(documentId, originalText, options).catch((error) => {
      console.error(`Document ${documentId} analysis failed`, error.message);
    });
  });
}
