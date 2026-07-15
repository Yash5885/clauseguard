import { GoogleGenAI } from "@google/genai";
import {
  EMBEDDING_DIMENSIONS,
  EMBEDDING_TASK_PREFIX,
  getEmbeddingModel,
  validateEmbeddingModel,
} from "../config/ai.js";

export function formatClauseForEmbedding({ category, clauseText }) {
  const normalizedCategory = category?.trim();
  const normalizedClause = clauseText?.trim();

  if (!normalizedCategory || !normalizedClause) {
    throw new Error("Embedding input requires both a category and clause text");
  }

  // Uploaded clauses must use this exact formatter, model, and dimension count.
  // Mixing embedding spaces makes cosine similarity scores meaningless.
  return `${EMBEDDING_TASK_PREFIX} Category: ${normalizedCategory}\nClause: ${normalizedClause}`;
}

export function createGeminiClient() {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to .env before generating embeddings",
    );
  }

  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export async function createClauseEmbeddings(
  clauses,
  {
    client = createGeminiClient(),
    dimensions = EMBEDDING_DIMENSIONS,
    model = getEmbeddingModel(),
  } = {},
) {
  if (!Array.isArray(clauses) || clauses.length === 0) {
    throw new Error("At least one clause is required to generate embeddings");
  }

  validateEmbeddingModel(model);
  const response = await client.models.embedContent({
    model,
    // Separate Content objects make Gemini return one vector per clause instead
    // of aggregating the entire batch into a single embedding.
    contents: clauses.map((clause) => ({
      parts: [{ text: formatClauseForEmbedding(clause) }],
    })),
    config: { outputDimensionality: dimensions },
  });
  const orderedEmbeddings = response.embeddings?.map((item) => item.values) ?? [];

  if (orderedEmbeddings.length !== clauses.length) {
    throw new Error(
      `Gemini returned ${orderedEmbeddings.length} embeddings for ${clauses.length} clauses`,
    );
  }

  for (const embedding of orderedEmbeddings) {
    if (embedding.length !== dimensions) {
      throw new Error(
        `Expected ${dimensions} embedding dimensions but received ${embedding.length}`,
      );
    }

    if (!embedding.every(Number.isFinite)) {
      throw new Error("Embedding contains a non-finite number");
    }
  }

  return {
    dimensions,
    embeddings: orderedEmbeddings,
    model,
  };
}

export function serializePgVector(embedding) {
  if (
    !Array.isArray(embedding) ||
    embedding.length !== EMBEDDING_DIMENSIONS ||
    !embedding.every(Number.isFinite)
  ) {
    throw new Error(`A valid ${EMBEDDING_DIMENSIONS}-dimension embedding is required`);
  }

  return `[${embedding.join(",")}]`;
}
