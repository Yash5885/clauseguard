import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import request from "supertest";
import { MAX_UPLOAD_BYTES } from "../src/middleware/upload.js";
import { createDocumentsRouter } from "../src/routes/documents.js";
import { processDocumentUpload } from "../src/services/documentService.js";
import { createDocxBuffer, createPdfBuffer } from "../test-support/fixtures.js";

function createFakeDatabase() {
  const documents = [];
  let nextId = 1;

  return {
    documents,
    async query(sql, parameters) {
      if (sql.includes("INSERT INTO documents")) {
        const document = {
          id: String(nextId++),
          userId: String(parameters[0]),
          filename: parameters[1],
          originalText: "",
          uploadDate: new Date("2026-07-16T00:00:00.000Z"),
          overallRiskScore: null,
          status: "processing",
        };
        documents.push(document);
        return { rows: [document] };
      }

      if (sql.includes("SET original_text")) {
        const document = documents.find((item) => item.id === parameters[1]);
        document.originalText = parameters[0];
        document.status = "complete";
        return { rows: [document] };
      }

      if (sql.includes("status = 'failed'")) {
        const document = documents.find((item) => item.id === parameters[0]);
        document.status = "failed";
        return { rows: [] };
      }

      throw new Error(`Unexpected query: ${sql}`);
    },
  };
}

function createTestApp({ authenticated = true } = {}) {
  const database = createFakeDatabase();
  const authMiddleware = (requestObject, response, next) => {
    if (!authenticated) {
      response.status(401).json({ error: "Authentication required" });
      return;
    }

    requestObject.clerkAuth = { userId: "user_clerk_test" };
    next();
  };
  const processUpload = (clerkUserId, file) =>
    processDocumentUpload(clerkUserId, file, {
      database,
      syncUser: async (userId) => {
        assert.equal(userId, "user_clerk_test");
        return { id: "42" };
      },
    });
  const app = express();
  app.use("/api", createDocumentsRouter({ authMiddleware, processUpload }));
  app.use((error, _request, response, _next) => {
    response.status(500).json({ error: error.message });
  });

  return { app, database };
}

test("authenticated PDF upload extracts and stores raw text", async () => {
  const { app, database } = createTestApp();
  const response = await request(app)
    .post("/api/documents")
    .attach("file", createPdfBuffer("Payment is due in thirty days."), {
      filename: "agreement.pdf",
      contentType: "application/pdf",
    });

  assert.equal(response.status, 201, JSON.stringify(response.body));
  assert.equal(response.body.document.filename, "agreement.pdf");
  assert.equal(response.body.document.status, "complete");
  assert.match(response.body.document.textPreview, /Payment is due in thirty days/);
  assert.equal(database.documents.length, 1);
  assert.match(database.documents[0].originalText, /Payment is due in thirty days/);
  assert.equal(database.documents[0].status, "complete");
});

test("authenticated DOCX upload extracts and stores raw text", async () => {
  const { app, database } = createTestApp();
  const response = await request(app)
    .post("/api/documents")
    .attach("file", await createDocxBuffer("Either party may terminate with notice."), {
      filename: "agreement.docx",
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

  assert.equal(response.status, 201, JSON.stringify(response.body));
  assert.equal(response.body.document.status, "complete");
  assert.match(response.body.document.textPreview, /Either party may terminate/);
  assert.match(database.documents[0].originalText, /Either party may terminate/);
});

test("unsupported file types are rejected clearly", async () => {
  const { app, database } = createTestApp();
  const response = await request(app)
    .post("/api/documents")
    .attach("file", Buffer.from("not a contract"), {
      filename: "notes.txt",
      contentType: "text/plain",
    });

  assert.equal(response.status, 415);
  assert.equal(response.body.code, "UNSUPPORTED_FILE_TYPE");
  assert.equal(database.documents.length, 0);
});

test("files larger than 10 MB are rejected before extraction", async () => {
  const { app, database } = createTestApp();
  const response = await request(app)
    .post("/api/documents")
    .attach("file", Buffer.alloc(MAX_UPLOAD_BYTES + 1), {
      filename: "too-large.pdf",
      contentType: "application/pdf",
    });

  assert.equal(response.status, 413);
  assert.equal(response.body.code, "FILE_TOO_LARGE");
  assert.equal(database.documents.length, 0);
});

test("corrupted documents return a clear extraction error and are marked failed", async () => {
  const { app, database } = createTestApp();
  const response = await request(app)
    .post("/api/documents")
    .attach("file", Buffer.from("this is not really a PDF"), {
      filename: "corrupted.pdf",
      contentType: "application/pdf",
    });

  assert.equal(response.status, 422, JSON.stringify(response.body));
  assert.equal(response.body.code, "TEXT_EXTRACTION_FAILED");
  assert.match(response.body.error, /corrupted|invalid/i);
  assert.equal(database.documents[0].status, "failed");
});

test("unauthenticated uploads are rejected before multipart processing", async () => {
  const { app, database } = createTestApp({ authenticated: false });
  const response = await request(app)
    .post("/api/documents")
    .attach("file", createPdfBuffer(), {
      filename: "agreement.pdf",
      contentType: "application/pdf",
    });

  assert.equal(response.status, 401);
  assert.equal(response.body.error, "Authentication required");
  assert.equal(database.documents.length, 0);
});
