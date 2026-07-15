import path from "node:path";
import { getDatabasePool } from "../config/database.js";
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
      SET original_text = $1, status = 'complete'
      WHERE id = $2
      RETURNING id, user_id AS "userId", filename, original_text AS "originalText",
        upload_date AS "uploadDate", overall_risk_score AS "overallRiskScore", status
    `,
    [originalText, document.id],
  );

  return updateResult.rows[0];
}
