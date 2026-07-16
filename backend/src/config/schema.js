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

    ALTER TABLE documents
      ADD COLUMN IF NOT EXISTS analysis_error TEXT;

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

    CREATE TABLE IF NOT EXISTS clauses (
      id BIGSERIAL PRIMARY KEY,
      document_id BIGINT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      clause_text TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN (
        'Payment Terms',
        'IP Rights',
        'Termination',
        'Liability',
        'Revisions',
        'Confidentiality',
        'Kill Fee',
        'Late Payment Penalty',
        'Uncategorized'
      )),
      risk_label TEXT NOT NULL CHECK (risk_label IN ('safe', 'caution', 'risky')),
      explanation TEXT,
      order_index INTEGER NOT NULL CHECK (order_index >= 0),
      closest_baseline_clause_id BIGINT REFERENCES baseline_clauses(id) ON DELETE SET NULL,
      similarity_score DOUBLE PRECISION CHECK (
        similarity_score IS NULL OR similarity_score BETWEEN -1 AND 1
      ),
      UNIQUE (document_id, order_index)
    );

    CREATE INDEX IF NOT EXISTS clauses_document_order_idx
      ON clauses (document_id, order_index);

    CREATE TABLE IF NOT EXISTS clause_embeddings (
      id BIGSERIAL PRIMARY KEY,
      clause_id BIGINT NOT NULL UNIQUE REFERENCES clauses(id) ON DELETE CASCADE,
      embedding VECTOR(768) NOT NULL,
      embedding_model TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS clause_embeddings_hnsw_idx
      ON clause_embeddings USING hnsw (embedding vector_cosine_ops);
  `);
}
