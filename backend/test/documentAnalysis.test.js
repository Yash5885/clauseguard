import assert from "node:assert/strict";
import test from "node:test";
import {
  analyzeDocument,
  DocumentAnalysisError,
} from "../src/services/documentAnalysis.js";
import { SegmentationError } from "../src/services/segmentation.js";
import { EMBEDDING_DIMENSIONS } from "../src/config/ai.js";

function createAnalysisDatabase() {
  const insertedClauses = [];
  const insertedEmbeddings = [];
  const documentUpdates = [];
  const baselineMatches = {
    "Payment Terms": { id: "101", clauseText: "Fair payment", similarity: "0.90" },
    Revisions: { id: "102", clauseText: "Fair revisions", similarity: "0.78" },
    Termination: { id: "103", clauseText: "Fair termination", similarity: "0.60" },
  };
  let nextClauseId = 1;
  const connection = {
    released: false,
    async query(sql, parameters = []) {
      if (["BEGIN", "COMMIT", "ROLLBACK"].includes(sql)) {
        return { rows: [] };
      }
      if (sql.startsWith("DELETE FROM clauses")) {
        return { rows: [] };
      }
      if (sql.includes("FROM baseline_clauses")) {
        const match = baselineMatches[parameters[1]];
        return { rows: match ? [match] : [] };
      }
      if (sql.includes("INSERT INTO clauses")) {
        insertedClauses.push(parameters);
        return { rows: [{ id: String(nextClauseId++) }] };
      }
      if (sql.includes("INSERT INTO clause_embeddings")) {
        insertedEmbeddings.push(parameters);
        return { rows: [] };
      }
      if (sql.includes("SET status = 'complete'")) {
        documentUpdates.push({ status: "complete", parameters });
        return { rows: [] };
      }
      throw new Error(`Unexpected transaction query: ${sql}`);
    },
    release() {
      this.released = true;
    },
  };
  const database = {
    failedUpdates: [],
    async connect() {
      return connection;
    },
    async query(sql, parameters) {
      if (sql.includes("SET status = 'failed'")) {
        this.failedUpdates.push(parameters);
        return { rows: [] };
      }
      throw new Error(`Unexpected pool query: ${sql}`);
    },
  };

  return {
    connection,
    database,
    documentUpdates,
    insertedClauses,
    insertedEmbeddings,
  };
}

test("document analysis stores clauses, matches, vectors, labels, and score", async () => {
  const state = createAnalysisDatabase();
  const segmentedClauses = [
    { category: "Payment Terms", clauseText: "Payment in 14 days", orderIndex: 0 },
    { category: "Revisions", clauseText: "Four revision rounds", orderIndex: 1 },
    { category: "Termination", clauseText: "Termination clause", orderIndex: 2 },
  ];
  const embeddings = segmentedClauses.map((_clause, index) => {
    const vector = Array(EMBEDDING_DIMENSIONS).fill(0);
    vector[index] = 1;
    return vector;
  });

  const result = await analyzeDocument("7", "Contract text", {
    database: state.database,
    embeddingModel: "gemini-embedding-2",
    segmentText: async () => segmentedClauses,
    embedClauses: async () => ({ embeddings }),
  });

  assert.deepEqual(
    result.clauses.map((clause) => clause.riskLabel),
    ["safe", "caution", "risky"],
  );
  assert.equal(result.overallRiskScore, 4);
  assert.equal(state.insertedClauses.length, 3);
  assert.equal(state.insertedEmbeddings.length, 3);
  assert.equal(state.insertedEmbeddings[0][2], "gemini-embedding-2");
  assert.deepEqual(state.documentUpdates[0].parameters, [4, "7"]);
  assert.equal(state.connection.released, true);
});

test("empty or malformed segmentation marks the document failed", async () => {
  const state = createAnalysisDatabase();

  await assert.rejects(
    analyzeDocument("9", "Contract text", {
      database: state.database,
      segmentText: async () => {
        throw new SegmentationError("Gemini returned no contract clauses");
      },
    }),
    (error) =>
      error instanceof DocumentAnalysisError && /no contract clauses/.test(error.message),
  );

  assert.deepEqual(state.database.failedUpdates[0], [
    "Gemini returned no contract clauses",
    "9",
  ]);
});
