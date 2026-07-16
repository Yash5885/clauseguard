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
import {
  ExplanationError,
  generateFlaggedClauseExplanations,
} from "./explanations.js";
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

  if (error instanceof ExplanationError) {
    return "Gemini could not generate grounded clause explanations. Please retry.";
  }

  if (/embedding|Gemini|baseline/i.test(error?.message ?? "")) {
    return "The AI analysis service could not process this contract. Please retry.";
  }

  return "Contract analysis failed. Please retry.";
}

async function findClosestBaseline(
  database,
  { category, embedding, embeddingModel },
) {
  const result = await database.query(
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

async function compareClauses(
  database,
  { embeddingModel, embeddings, segmentedClauses },
) {
  const analyzedClauses = [];

  for (let index = 0; index < segmentedClauses.length; index += 1) {
    const clause = segmentedClauses[index];
    const embedding = embeddings[index];
    const closestBaseline = await findClosestBaseline(database, {
      category: clause.category,
      embedding,
      embeddingModel,
    });
    const riskLabel = classifyClauseRisk({
      category: clause.category,
      clauseText: clause.clauseText,
      similarity: closestBaseline?.similarity,
    });

    analyzedClauses.push({
      ...clause,
      embedding,
      riskLabel,
      similarity: closestBaseline?.similarity ?? null,
      closestBaseline,
    });
  }

  return analyzedClauses;
}

function attachExplanations(analyzedClauses, explanations) {
  return analyzedClauses.map((clause) => {
    if (clause.riskLabel === "safe") {
      return { ...clause, explanation: null };
    }

    const explanation = explanations.get(clause.orderIndex);
    if (!explanation) {
      throw new ExplanationError(
        `No explanation was generated for flagged clause ${clause.orderIndex}`,
      );
    }

    return { ...clause, explanation };
  });
}

async function storeAnalyzedClauses(
  connection,
  { analyzedClauses, documentId, embeddingModel },
) {
  const storedClauses = [];

  await connection.query("DELETE FROM clauses WHERE document_id = $1", [documentId]);

  for (const clause of analyzedClauses) {
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `,
      [
        documentId,
        clause.clauseText,
        clause.category,
        clause.riskLabel,
        clause.explanation,
        clause.orderIndex,
        clause.closestBaseline?.id ?? null,
        clause.similarity,
      ],
    );
    const clauseId = insertClauseResult.rows[0].id;

    await connection.query(
      `
        INSERT INTO clause_embeddings (clause_id, embedding, embedding_model)
        VALUES ($1, $2::vector, $3)
      `,
      [clauseId, serializePgVector(clause.embedding), embeddingModel],
    );

    storedClauses.push({ ...clause, id: clauseId });
  }

  return storedClauses;
}

export async function analyzeDocument(
  documentId,
  originalText,
  {
    database = getDatabasePool(),
    embedClauses = createClauseEmbeddingsInBatches,
    embeddingModel = getEmbeddingModel(),
    explainClauses = generateFlaggedClauseExplanations,
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

    const comparedClauses = await compareClauses(database, {
      embeddingModel,
      embeddings: embedded.embeddings,
      segmentedClauses,
    });
    const overallRiskScore = calculateOverallRiskScore(
      comparedClauses.map((clause) => clause.riskLabel),
    );
    const explanations = await explainClauses(comparedClauses);
    const completedClauses = attachExplanations(comparedClauses, explanations);

    connection = await database.connect();
    await connection.query("BEGIN");
    transactionStarted = true;

    const analyzedClauses = await storeAnalyzedClauses(connection, {
      analyzedClauses: completedClauses,
      documentId,
      embeddingModel,
    });

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
