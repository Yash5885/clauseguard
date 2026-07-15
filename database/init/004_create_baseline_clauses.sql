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

CREATE INDEX IF NOT EXISTS baseline_clauses_category_idx
  ON baseline_clauses (category);

CREATE INDEX IF NOT EXISTS baseline_clauses_embedding_hnsw_idx
  ON baseline_clauses USING hnsw (embedding vector_cosine_ops);
