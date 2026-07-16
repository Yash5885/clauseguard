import { getGenerationFallbackModel } from "../config/ai.js";

export class GeminiCapacityError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "GeminiCapacityError";
  }
}

export function isGeminiCapacityError(error) {
  const message = error?.message ?? "";
  const status = Number(error?.status ?? error?.code);

  return (
    [429, 500, 502, 503, 504].includes(status) ||
    /RESOURCE_EXHAUSTED|UNAVAILABLE|quota exceeded|rate limit|high demand|temporarily unavailable/i.test(
      message,
    )
  );
}

export async function generateStructuredContent(
  { client, config, contents, model },
  { fallbackModel = getGenerationFallbackModel() } = {},
) {
  try {
    return await client.models.generateContent({
      model,
      contents,
      config,
    });
  } catch (error) {
    if (!isGeminiCapacityError(error) || !fallbackModel || fallbackModel === model) {
      throw error;
    }

    // Gemini quotas are model-specific. A stable structured-output fallback
    // keeps an in-progress review moving when the primary free-tier quota is full.
    try {
      return await client.models.generateContent({
        model: fallbackModel,
        contents,
        config,
      });
    } catch (fallbackError) {
      if (isGeminiCapacityError(fallbackError)) {
        throw new GeminiCapacityError(
          "All configured generation models are currently rate limited",
          { cause: fallbackError },
        );
      }

      throw fallbackError;
    }
  }
}
