ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS analysis_error TEXT;

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
