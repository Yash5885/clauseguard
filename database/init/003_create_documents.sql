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
