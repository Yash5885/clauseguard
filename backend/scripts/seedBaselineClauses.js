import dotenv from "dotenv";

dotenv.config({ path: new URL("../../.env", import.meta.url) });

const { closeDatabaseConnection, getDatabasePool } = await import(
  "../src/config/database.js"
);
const { ensureDatabaseSchema } = await import("../src/config/schema.js");
const {
  BASELINE_CATEGORIES,
  baselineClauses,
  baselineClausesByCategory,
} = await import("../src/data/baselineClauses.js");

function validateCatalog() {
  const seenClauses = new Set();

  for (const category of BASELINE_CATEGORIES) {
    const entries = baselineClausesByCategory[category];

    if (!entries || entries.length < 15 || entries.length > 20) {
      throw new Error(
        `${category} must contain between 15 and 20 clauses; found ${entries?.length ?? 0}`,
      );
    }

    for (const entry of entries) {
      const key = `${category}\u0000${entry.clauseText}`;

      if (!entry.clauseText.trim() || !entry.principle.trim()) {
        throw new Error(`${category} contains an incomplete catalog entry`);
      }

      if (seenClauses.has(key)) {
        throw new Error(`${category} contains a duplicate clause`);
      }

      seenClauses.add(key);
    }
  }
}

async function seedBaselineClauses() {
  validateCatalog();
  await ensureDatabaseSchema();
  const database = getDatabasePool();
  const connection = await database.connect();
  let inserted = 0;

  try {
    await connection.query("BEGIN");

    for (const clause of baselineClauses) {
      const result = await connection.query(
        `
          INSERT INTO baseline_clauses (category, clause_text)
          VALUES ($1, $2)
          ON CONFLICT (category, clause_text) DO NOTHING
        `,
        [clause.category, clause.clauseText],
      );
      inserted += result.rowCount;
    }

    await connection.query("COMMIT");
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }

  const countResult = await database.query(`
    SELECT category, COUNT(*)::integer AS count
    FROM baseline_clauses
    GROUP BY category
    ORDER BY category
  `);

  console.log(
    JSON.stringify({
      inserted,
      totalCatalogClauses: baselineClauses.length,
      rowsByCategory: countResult.rows,
    }),
  );
}

try {
  await seedBaselineClauses();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await closeDatabaseConnection();
}
