import dotenv from "dotenv";

dotenv.config({ path: new URL("../../.env", import.meta.url) });

const {
  EMBEDDING_BATCH_DELAY_MS,
  EMBEDDING_BATCH_SIZE,
  getEmbeddingModel,
} = await import("../src/config/ai.js");
const { closeDatabaseConnection, getDatabasePool } = await import(
  "../src/config/database.js"
);
const { ensureDatabaseSchema } = await import("../src/config/schema.js");
const {
  createClauseEmbeddings,
  createGeminiClient,
  serializePgVector,
} = await import("../src/services/embeddings.js");

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isRateLimitError(error) {
  return error?.status === 429 || error?.status === "RESOURCE_EXHAUSTED" ||
    /429|RESOURCE_EXHAUSTED|quota/i.test(error?.message ?? "");
}

async function createEmbeddingsWithRetry(batch, options) {
  const maximumAttempts = 7;

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      return await createClauseEmbeddings(batch, options);
    } catch (error) {
      if (!isRateLimitError(error) || attempt === maximumAttempts) {
        throw error;
      }

      console.warn(
        `Gemini free-tier rate limit reached; retrying batch in ${EMBEDDING_BATCH_DELAY_MS / 1000} seconds`,
      );
      await wait(EMBEDDING_BATCH_DELAY_MS);
    }
  }

  throw new Error("Gemini embedding retry loop exited unexpectedly");
}

async function storeEmbeddingBatch(database, rows, embeddings, model) {
  const connection = await database.connect();

  try {
    await connection.query("BEGIN");

    for (let index = 0; index < rows.length; index += 1) {
      await connection.query(
        `
          UPDATE baseline_clauses
          SET embedding = $1::vector, embedding_model = $2
          WHERE id = $3
        `,
        [serializePgVector(embeddings[index]), model, rows[index].id],
      );
    }

    await connection.query("COMMIT");
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
}

async function generateBaselineEmbeddings() {
  await ensureDatabaseSchema();
  const database = getDatabasePool();
  const gemini = createGeminiClient();
  const model = getEmbeddingModel();
  const force = process.argv.includes("--force");
  const result = await database.query(
    `
      SELECT id, category, clause_text AS "clauseText"
      FROM baseline_clauses
      WHERE $1::boolean
        OR embedding IS NULL
        OR embedding_model IS DISTINCT FROM $2
      ORDER BY id
    `,
    [force, model],
  );
  let processed = 0;

  for (let start = 0; start < result.rows.length; start += EMBEDDING_BATCH_SIZE) {
    const batch = result.rows.slice(start, start + EMBEDDING_BATCH_SIZE);
    const embedded = await createEmbeddingsWithRetry(batch, {
      client: gemini,
      model,
    });
    await storeEmbeddingBatch(database, batch, embedded.embeddings, model);
    processed += batch.length;
    console.log(`Embedded ${processed}/${result.rows.length} baseline clauses`);

    // Gemini's free tier counts each Content object toward its per-minute quota.
    // Pacing keeps full 128-row runs below that rolling limit.
    if (start + EMBEDDING_BATCH_SIZE < result.rows.length) {
      await wait(EMBEDDING_BATCH_DELAY_MS);
    }
  }

  const verification = await database.query(
    `
      SELECT
        COUNT(*)::integer AS total,
        COUNT(embedding)::integer AS embedded,
        COUNT(*) FILTER (WHERE embedding_model = $1)::integer AS "currentModel"
      FROM baseline_clauses
    `,
    [model],
  );

  console.log(
    JSON.stringify({
      model,
      processed,
      verification: verification.rows[0],
    }),
  );
}

try {
  await generateBaselineEmbeddings();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await closeDatabaseConnection();
}
