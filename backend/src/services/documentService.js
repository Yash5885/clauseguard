import path from "node:path";
import { getDatabasePool } from "../config/database.js";
import { enqueueDocumentAnalysis } from "./documentAnalysis.js";
import { extractTextFromFile, TextExtractionError } from "./textExtraction.js";
import { syncClerkUser } from "./userSync.js";

function getSafeFilename(originalName) {
  const filename = path
    .basename(originalName.replaceAll("\\", "/"))
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();

  return Array.from(filename || "document").slice(0, 255).join("");
}

export async function processDocumentUpload(
  clerkUserId,
  file,
  {
    database = getDatabasePool(),
    enqueueAnalysis = enqueueDocumentAnalysis,
    extractText = extractTextFromFile,
    syncUser = syncClerkUser,
  } = {},
) {
  const user = await syncUser(clerkUserId);
  const filename = getSafeFilename(file.originalname);
  const insertResult = await database.query(
    `
      INSERT INTO documents (user_id, filename, original_text, status)
      VALUES ($1, $2, '', 'processing')
      RETURNING id, user_id AS "userId", filename, upload_date AS "uploadDate",
        overall_risk_score AS "overallRiskScore", status
    `,
    [user.id, filename],
  );
  const document = insertResult.rows[0];

  let originalText;

  try {
    originalText = await extractText(file);
  } catch (error) {
    try {
      await database.query(
        "UPDATE documents SET status = 'failed' WHERE id = $1",
        [document.id],
      );
    } catch (statusError) {
      console.error("Failed to mark document extraction as failed", statusError);
    }

    const extractionError =
      error instanceof TextExtractionError
        ? error
        : new TextExtractionError("Text extraction failed", { cause: error });
    extractionError.documentId = document.id;
    throw extractionError;
  }

  const updateResult = await database.query(
    `
      UPDATE documents
      SET original_text = $1, status = 'processing', analysis_error = NULL
      WHERE id = $2
      RETURNING id, user_id AS "userId", filename, original_text AS "originalText",
        upload_date AS "uploadDate", overall_risk_score AS "overallRiskScore", status,
        analysis_error AS "analysisError"
    `,
    [originalText, document.id],
  );

  enqueueAnalysis(document.id, originalText, { database });

  return updateResult.rows[0];
}

export async function listUserDocuments(
  clerkUserId,
  { database = getDatabasePool(), limit = 50 } = {},
) {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const result = await database.query(
    `
      SELECT
        documents.id,
        documents.filename,
        documents.upload_date AS "uploadDate",
        documents.overall_risk_score AS "overallRiskScore",
        documents.status,
        documents.analysis_error AS "analysisError",
        LENGTH(documents.original_text)::integer AS "extractedCharacters",
        COUNT(clauses.id) FILTER (WHERE clauses.risk_label = 'safe')::integer AS "safeCount",
        COUNT(clauses.id) FILTER (WHERE clauses.risk_label = 'caution')::integer AS "cautionCount",
        COUNT(clauses.id) FILTER (WHERE clauses.risk_label = 'risky')::integer AS "riskyCount"
      FROM documents
      INNER JOIN users ON users.id = documents.user_id
      LEFT JOIN clauses ON clauses.document_id = documents.id
      WHERE users.auth_provider_id = $1
      GROUP BY documents.id
      ORDER BY documents.upload_date DESC
      LIMIT $2
    `,
    [clerkUserId, safeLimit],
  );

  return result.rows.map((document) => ({
    id: document.id,
    filename: document.filename,
    uploadDate: document.uploadDate,
    overallRiskScore: document.overallRiskScore,
    status: document.status,
    analysisError: document.analysisError,
    extractedCharacters: document.extractedCharacters,
    riskSummary: {
      safe: Number(document.safeCount) || 0,
      caution: Number(document.cautionCount) || 0,
      risky: Number(document.riskyCount) || 0,
    },
  }));
}

export async function getDocumentAnalysis(
  clerkUserId,
  documentId,
  { database = getDatabasePool() } = {},
) {
  if (!/^\d+$/.test(String(documentId))) {
    return null;
  }

  const documentResult = await database.query(
    `
      SELECT
        documents.id,
        documents.filename,
        documents.upload_date AS "uploadDate",
        documents.overall_risk_score AS "overallRiskScore",
        documents.status,
        documents.analysis_error AS "analysisError",
        LENGTH(documents.original_text)::integer AS "extractedCharacters",
        LEFT(documents.original_text, 240) AS "textPreview"
      FROM documents
      INNER JOIN users ON users.id = documents.user_id
      WHERE documents.id = $1
        AND users.auth_provider_id = $2
    `,
    [documentId, clerkUserId],
  );
  const document = documentResult.rows[0];

  if (!document) {
    return null;
  }

  const clausesResult = await database.query(
    `
      SELECT
        clauses.id,
        clauses.clause_text AS "clauseText",
        clauses.category,
        clauses.risk_label AS "riskLabel",
        clauses.explanation,
        clauses.order_index AS "orderIndex",
        clauses.similarity_score AS similarity,
        baseline_clauses.id AS "closestBaselineId",
        baseline_clauses.clause_text AS "closestBaselineText"
      FROM clauses
      LEFT JOIN baseline_clauses
        ON baseline_clauses.id = clauses.closest_baseline_clause_id
      WHERE clauses.document_id = $1
      ORDER BY clauses.order_index
    `,
    [documentId],
  );
  const riskSummary = { safe: 0, caution: 0, risky: 0 };

  for (const clause of clausesResult.rows) {
    riskSummary[clause.riskLabel] += 1;
    clause.similarity =
      clause.similarity === null ? null : Number(clause.similarity);
  }

  return { ...document, clauses: clausesResult.rows, riskSummary };
}
