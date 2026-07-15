import { getDatabasePool } from "./database.js";

export async function ensureDatabaseSchema() {
  await getDatabasePool().query(`
    CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL DEFAULT '',
      auth_provider_id TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS documents (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      original_text TEXT NOT NULL DEFAULT '',
      upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      overall_risk_score INTEGER,
      status TEXT NOT NULL DEFAULT 'processing'
        CHECK (status IN ('processing', 'complete', 'failed'))
    );

    CREATE INDEX IF NOT EXISTS documents_user_upload_date_idx
      ON documents (user_id, upload_date DESC);

    CREATE TABLE IF NOT EXISTS baseline_clauses (
      id BIGSERIAL PRIMARY KEY,
      category TEXT NOT NULL CHECK (category IN (
        'Payment Terms',
        'IP Rights',
        'Termination',
        'Liability',
        'Revisions',
        'Confidentiality',
        'Kill Fee',
        'Late Payment Penalty'
      )),
      clause_text TEXT NOT NULL,
      embedding VECTOR(768),
      embedding_model TEXT,
      UNIQUE (category, clause_text)
    );

    DO $schema$
    DECLARE
      current_embedding_type TEXT;
    BEGIN
      SELECT format_type(attribute.atttypid, attribute.atttypmod)
      INTO current_embedding_type
      FROM pg_attribute AS attribute
      WHERE attribute.attrelid = 'baseline_clauses'::regclass
        AND attribute.attname = 'embedding'
        AND NOT attribute.attisdropped;

      IF current_embedding_type IS DISTINCT FROM 'vector(768)' THEN
        DROP INDEX IF EXISTS baseline_clauses_embedding_hnsw_idx;
        UPDATE baseline_clauses
        SET embedding = NULL, embedding_model = NULL;
        ALTER TABLE baseline_clauses
          ALTER COLUMN embedding TYPE VECTOR(768)
          USING NULL::VECTOR(768);
      END IF;
    END
    $schema$;

    CREATE INDEX IF NOT EXISTS baseline_clauses_category_idx
      ON baseline_clauses (category);

    CREATE INDEX IF NOT EXISTS baseline_clauses_embedding_hnsw_idx
      ON baseline_clauses USING hnsw (embedding vector_cosine_ops);
  `);
}
