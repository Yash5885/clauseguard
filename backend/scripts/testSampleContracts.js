import dotenv from "dotenv";

dotenv.config({ path: new URL("../../.env", import.meta.url) });

const { getExplanationModel, getSegmentationModel } = await import(
  "../src/config/ai.js"
);
const { closeDatabaseConnection, getDatabasePool } = await import(
  "../src/config/database.js"
);
const { ensureDatabaseSchema } = await import("../src/config/schema.js");
const { analyzeDocument } = await import("../src/services/documentAnalysis.js");
const { SAMPLE_CONTRACTS } = await import("../test-support/sampleContracts.js");

async function assertBaselineReady(database) {
  const result = await database.query(`
    SELECT COUNT(*)::integer AS total, COUNT(embedding)::integer AS embedded
    FROM baseline_clauses
  `);
  const counts = result.rows[0];

  if (counts.total !== 128 || counts.embedded !== 128) {
    throw new Error(
      "The sample runner requires all 128 baseline clauses and embeddings. Run the seed and embedding scripts first.",
    );
  }
}

async function createSampleUser(database) {
  const result = await database.query(`
    INSERT INTO users (email, name, auth_provider_id)
    VALUES ('pipeline-samples@clauseguard.local', 'Pipeline Samples', 'sample_pipeline_runner')
    ON CONFLICT (auth_provider_id) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `);

  return result.rows[0];
}

async function loadDocumentResult(database, documentId, sample) {
  const documentResult = await database.query(
    `
      SELECT overall_risk_score AS "overallRiskScore", status, analysis_error AS "analysisError"
      FROM documents
      WHERE id = $1
    `,
    [documentId],
  );
  const clausesResult = await database.query(
    `
      SELECT
        clauses.order_index AS "orderIndex",
        clauses.category,
        clauses.risk_label AS "riskLabel",
        ROUND(clauses.similarity_score::numeric, 4) AS similarity,
        clauses.clause_text AS "clauseText",
        clauses.explanation,
        baseline_clauses.clause_text AS "closestBaselineText"
      FROM clauses
      LEFT JOIN baseline_clauses
        ON baseline_clauses.id = clauses.closest_baseline_clause_id
      WHERE clauses.document_id = $1
      ORDER BY clauses.order_index
    `,
    [documentId],
  );

  return {
    slug: sample.slug,
    description: sample.description,
    ...documentResult.rows[0],
    clauses: clausesResult.rows.map((clause) => ({
      ...clause,
      similarity: clause.similarity === null ? null : Number(clause.similarity),
    })),
  };
}

async function runSamples() {
  await ensureDatabaseSchema();
  const database = getDatabasePool();
  await assertBaselineReady(database);
  const user = await createSampleUser(database);
  const requestedSlugs = process.argv.slice(2).filter((argument) => argument !== "--");
  const selectedSamples = requestedSlugs.length
    ? SAMPLE_CONTRACTS.filter((sample) => requestedSlugs.includes(sample.slug))
    : SAMPLE_CONTRACTS;

  if (selectedSamples.length === 0) {
    throw new Error(`No sample matched: ${requestedSlugs.join(", ")}`);
  }

  const results = [];

  for (const sample of selectedSamples) {
    await database.query(
      "DELETE FROM documents WHERE user_id = $1 AND filename = $2",
      [user.id, sample.filename],
    );
    const insertResult = await database.query(
      `
        INSERT INTO documents (user_id, filename, original_text, status)
        VALUES ($1, $2, $3, 'processing')
        RETURNING id
      `,
      [user.id, sample.filename, sample.text],
    );
    const documentId = insertResult.rows[0].id;

    await analyzeDocument(documentId, sample.text, { database });
    results.push(await loadDocumentResult(database, documentId, sample));
  }

  console.log(
    JSON.stringify(
      {
        explanationModel: getExplanationModel(),
        segmentationModel: getSegmentationModel(),
        sampleCount: results.length,
        results,
      },
      null,
      2,
    ),
  );
}

try {
  await runSamples();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await closeDatabaseConnection();
}
