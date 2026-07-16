import { Router } from "express";
import { requireAuthenticatedUser } from "../middleware/auth.js";
import { receiveDocumentUpload } from "../middleware/upload.js";
import {
  getDocumentAnalysis,
  listUserDocuments,
  processDocumentUpload,
} from "../services/documentService.js";
import { TextExtractionError } from "../services/textExtraction.js";

export function createDocumentsRouter({
  authMiddleware = requireAuthenticatedUser,
  getDocument = getDocumentAnalysis,
  listDocuments = listUserDocuments,
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

        response.status(202).json({
          document: {
            id: document.id,
            filename: document.filename,
            status: document.status,
            uploadDate: document.uploadDate,
            overallRiskScore: document.overallRiskScore,
            analysisError: document.analysisError,
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

  documentsRouter.get(
    "/documents",
    authMiddleware,
    async (request, response, next) => {
      try {
        const documents = await listDocuments(request.clerkAuth.userId);
        response.json({ documents });
      } catch (error) {
        next(error);
      }
    },
  );

  documentsRouter.get(
    "/documents/:documentId",
    authMiddleware,
    async (request, response, next) => {
      try {
        const document = await getDocument(
          request.clerkAuth.userId,
          request.params.documentId,
        );

        if (!document) {
          response.status(404).json({ error: "Document not found" });
          return;
        }

        response.json({ document });
      } catch (error) {
        next(error);
      }
    },
  );

  return documentsRouter;
}

export default createDocumentsRouter();
