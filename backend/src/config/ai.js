export const DEFAULT_EMBEDDING_MODEL = "gemini-embedding-2";
export const DEFAULT_SEGMENTATION_MODEL = "gemini-3.5-flash";
export const DEFAULT_EXPLANATION_MODEL = "gemini-3.5-flash";
export const EMBEDDING_DIMENSIONS = 768;
export const EMBEDDING_BATCH_SIZE = 16;
export const EMBEDDING_BATCH_DELAY_MS = 10_000;
export const EMBEDDING_TASK_PREFIX = "task: sentence similarity | query:";
export const MAX_SEGMENTED_CLAUSES = 200;
export const EXPLANATION_BATCH_SIZE = 20;

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

export function getSegmentationModel() {
  return process.env.GEMINI_SEGMENTATION_MODEL?.trim() || DEFAULT_SEGMENTATION_MODEL;
}

export function validateSegmentationModel(model = getSegmentationModel()) {
  if (model !== DEFAULT_SEGMENTATION_MODEL) {
    throw new Error(
      `GEMINI_SEGMENTATION_MODEL must be ${DEFAULT_SEGMENTATION_MODEL} for reproducible clause segmentation`,
    );
  }

  return model;
}

export function getExplanationModel() {
  return process.env.GEMINI_EXPLANATION_MODEL?.trim() || DEFAULT_EXPLANATION_MODEL;
}

export function validateExplanationModel(model = getExplanationModel()) {
  if (model !== DEFAULT_EXPLANATION_MODEL) {
    throw new Error(
      `GEMINI_EXPLANATION_MODEL must be ${DEFAULT_EXPLANATION_MODEL} for reproducible clause explanations`,
    );
  }

  return model;
}
