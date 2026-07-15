export const DEFAULT_EMBEDDING_MODEL = "gemini-embedding-2";
export const EMBEDDING_DIMENSIONS = 768;
export const EMBEDDING_BATCH_SIZE = 16;
export const EMBEDDING_BATCH_DELAY_MS = 10_000;
export const EMBEDDING_TASK_PREFIX = "task: sentence similarity | query:";

export function getEmbeddingModel() {
  return process.env.GEMINI_EMBEDDING_MODEL?.trim() || DEFAULT_EMBEDDING_MODEL;
}

export function validateEmbeddingModel(model = getEmbeddingModel()) {
  if (model !== DEFAULT_EMBEDDING_MODEL) {
    throw new Error(
      `GEMINI_EMBEDDING_MODEL must be ${DEFAULT_EMBEDDING_MODEL} so every clause stays in the same embedding space`,
    );
  }

  return model;
}
