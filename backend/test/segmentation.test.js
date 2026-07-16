import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSegmentationPrompt,
  clauseSegmentationSchema,
  MAX_CONTRACT_CHARACTERS,
  SegmentationError,
  segmentContractText,
  validateSegmentedClauses,
} from "../src/services/segmentation.js";

test("segmentContractText requests schema-constrained JSON and preserves order", async () => {
  let request;
  const client = {
    models: {
      async generateContent(parameters) {
        request = parameters;
        return {
          text: JSON.stringify([
            {
              clause: "Payment is due within fourteen days.",
              category: "Payment Terms",
            },
            {
              clause_text: "Either party may terminate on notice.",
              category: "Termination",
            },
          ]),
        };
      },
    },
  };

  const result = await segmentContractText("1. Payment.\n2. Termination.", {
    client,
    model: "gemini-3.5-flash",
  });

  assert.equal(request.model, "gemini-3.5-flash");
  assert.equal(request.config.temperature, 0);
  assert.deepEqual(
    request.config.responseFormat.text.schema,
    clauseSegmentationSchema,
  );
  assert.match(request.contents, /Return only a valid JSON array/);
  assert.deepEqual(
    result.map(({ category, orderIndex }) => ({ category, orderIndex })),
    [
      { category: "Payment Terms", orderIndex: 0 },
      { category: "Termination", orderIndex: 1 },
    ],
  );
});

test("malformed and empty Gemini segmentation output is rejected clearly", async () => {
  const malformedClient = {
    models: { generateContent: async () => ({ text: "not json" }) },
  };

  await assert.rejects(
    segmentContractText("A valid contract clause.", {
      client: malformedClient,
      model: "gemini-3.5-flash",
    }),
    (error) =>
      error instanceof SegmentationError && /malformed clause JSON/.test(error.message),
  );
  assert.throws(() => validateSegmentedClauses([]), /no contract clauses/);
  assert.throws(
    () =>
      validateSegmentedClauses([
        { clauseText: "Governing law applies.", category: "Governing Law" },
      ]),
    /unsupported category/,
  );
});

test("segmentation falls back to Flash-Lite when the primary model is unavailable", async () => {
  const requestedModels = [];
  const client = {
    models: {
      async generateContent(parameters) {
        requestedModels.push(parameters.model);

        if (parameters.model === "gemini-3.5-flash") {
          const error = new Error("UNAVAILABLE: model is experiencing high demand");
          error.status = 503;
          throw error;
        }

        return {
          text: JSON.stringify([
            {
              clause_text: "Payment is due within fourteen days.",
              category: "Payment Terms",
            },
          ]),
        };
      },
    },
  };

  const clauses = await segmentContractText("Payment terms", {
    client,
    fallbackModel: "gemini-3.1-flash-lite",
    model: "gemini-3.5-flash",
  });

  assert.deepEqual(requestedModels, [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
  ]);
  assert.equal(clauses.length, 1);
});

test("segmentation returns provider-neutral copy when all models are at capacity", async () => {
  const client = {
    models: {
      async generateContent() {
        const error = new Error("RESOURCE_EXHAUSTED: quota exceeded");
        error.status = 429;
        throw error;
      },
    },
  };

  await assert.rejects(
    segmentContractText("Payment terms", {
      client,
      fallbackModel: "gemini-3.1-flash-lite",
      model: "gemini-3.5-flash",
    }),
    (error) =>
      error instanceof SegmentationError &&
      /Clause Guard's analysis service is temporarily at capacity/.test(
        error.message,
      ) &&
      !/Gemini/.test(error.message),
  );
});

test("segmentation handles unusual input size with explicit limits", async () => {
  assert.match(buildSegmentationPrompt("Contract text"), /consolidate closely related/);
  await assert.rejects(
    segmentContractText("x".repeat(MAX_CONTRACT_CHARACTERS + 1), {
      client: {},
      model: "gemini-3.5-flash",
    }),
    /character analysis limit/,
  );
});
