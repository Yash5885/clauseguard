import { Router } from "express";
import { requireAuthenticatedUser } from "../middleware/auth.js";
import { receiveDocumentUpload } from "../middleware/upload.js";
import { processDocumentUpload } from "../services/documentService.js";
import { TextExtractionError } from "../services/textExtraction.js";

export function createDocumentsRouter({
  authMiddleware = requireAuthenticatedUser,
  processUpload = processDocumentUpload,
} = {}) {
  const documentsRouter = Router();

  documentsRouter.post(
    "/documents",
    authMiddleware,
    receiveDocumentUpload,
    async (request, response, next) => {
      try {
        const document = await processUpload(request.clerkAuth.userId, request.file);

        response.status(201).json({
          document: {
            id: document.id,
            filename: document.filename,
            status: document.status,
            uploadDate: document.uploadDate,
            overallRiskScore: document.overallRiskScore,
            extractedCharacters: document.originalText.length,
            textPreview: document.originalText.slice(0, 240),
          },
        });
      } catch (error) {
        if (error instanceof TextExtractionError) {
          response.status(422).json({
            error: error.message,
            code: "TEXT_EXTRACTION_FAILED",
            documentId: error.documentId,
          });
          return;
        }

        next(error);
      }
    },
  );

  return documentsRouter;
}

export default createDocumentsRouter();
