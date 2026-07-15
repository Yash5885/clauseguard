import assert from "node:assert/strict";
import test from "node:test";
import { EMBEDDING_DIMENSIONS } from "../src/config/ai.js";
import {
  createClauseEmbeddings,
  formatClauseForEmbedding,
  serializePgVector,
} from "../src/services/embeddings.js";

test("formatClauseForEmbedding includes normalized category and text", () => {
  assert.equal(
    formatClauseForEmbedding({
      category: " Payment Terms ",
      clauseText: " Payment is due in 15 days. ",
    }),
    "task: sentence similarity | query: Category: Payment Terms\nClause: Payment is due in 15 days.",
  );
});

test("createClauseEmbeddings requests one Gemini vector per clause", async () => {
  let request;
  const client = {
    models: {
      async embedContent(parameters) {
        request = parameters;
        return {
          embeddings: [
            { values: Array(EMBEDDING_DIMENSIONS).fill(0.1) },
            { values: Array(EMBEDDING_DIMENSIONS).fill(0.2) },
          ],
        };
      },
    },
  };
  const clauses = [
    { category: "Payment Terms", clauseText: "Payment is due in 15 days." },
    { category: "Termination", clauseText: "Either party may give notice." },
  ];
  const result = await createClauseEmbeddings(clauses, {
    client,
    model: "gemini-embedding-2",
  });

  assert.equal(request.model, "gemini-embedding-2");
  assert.equal(request.config.outputDimensionality, EMBEDDING_DIMENSIONS);
  assert.equal(request.contents.length, 2);
  assert.match(request.contents[0].parts[0].text, /^task: sentence similarity/);
  assert.equal(result.embeddings[0][0], 0.1);
  assert.equal(result.embeddings[1][0], 0.2);
});

test("serializePgVector validates vector dimensions", () => {
  const vector = Array(EMBEDDING_DIMENSIONS).fill(0.25);
  const serialized = serializePgVector(vector);

  assert.ok(serialized.startsWith("[0.25,0.25"));
  assert.ok(serialized.endsWith("]"));
  assert.throws(() => serializePgVector([0.25]), /768-dimension/);
});
