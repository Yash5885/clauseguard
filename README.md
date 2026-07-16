# Clause Guard

Clause Guard is a desktop-first web application for clause-by-clause risk reviews of freelance contracts. This repository currently contains the project foundation, managed authentication, authenticated document text extraction, the researched fair-clause baseline, Gemini clause segmentation, pgvector similarity-based risk labeling, and grounded explanations for flagged clauses.

## Stack

- Frontend: React (JavaScript), Vite, and Tailwind CSS
- API: Node.js and Express
- Database: PostgreSQL with pgvector
- Local infrastructure: Docker Compose
- Embedding provider: Google Gemini API
- Authentication: Clerk managed authentication
- Document extraction: Multer, pdf-parse, and Mammoth
- Similarity foundation: Gemini embeddings and pgvector
- Clause segmentation: Gemini 3.5 Flash structured JSON output
- Flagged-clause explanations: Gemini 3.5 Flash grounded comparison output

## Repository layout

```text
frontend/       React application
backend/        Express API and backend container
database/init/  PostgreSQL initialization scripts
compose.yaml    Local PostgreSQL + API services
```

## Local setup

Requirements: Node.js 24+, pnpm 11+, and Docker Desktop.

```bash
cp .env.example .env
# Add the Clerk publishable and secret keys to .env.
pnpm install
docker compose up -d database
pnpm dev
```

Open `http://localhost:5173`. The API health endpoints are available at:

- `GET http://localhost:3000/api/health`
- `GET http://localhost:3000/api/health/database`

The auth proof is available at:

- `/sign-up` and `/sign-in` for Clerk's managed flows
- `/dashboard` for the protected frontend route
- `GET /api/me` for the protected API and first-login database sync
- `POST /api/documents` for authenticated PDF/DOCX upload and raw-text extraction
- `GET /api/documents/:documentId` for protected processing status and clause results

The upload endpoint expects a multipart form field named `file`, accepts PDF and
DOCX files up to 10 MB, and returns HTTP 202 with status `processing` after text
extraction. Clause analysis continues in a background task; the protected
dashboard polls the document endpoint until the result is `complete` or `failed`.

## Fair-clause baseline

The version-controlled baseline catalog contains 16 clauses in each required
category (128 total). Every source entry includes a short principle explaining
the common practice behind it; the database stores the category, clause text,
embedding, and embedding model used.

Seed the text catalog idempotently:

```bash
pnpm seed:baselines
```

Then configure `GEMINI_API_KEY` in `.env` and generate any missing embeddings:

```bash
pnpm embed:baselines
```

The embedding script uses Google's latest stable `gemini-embedding-2` model,
explicitly requests 768 dimensions, batches API calls, and only processes
missing vectors or rows created with a different model. Google documents this
model and dimension as available on the Gemini API free tier. The generator
paces batches and retries rate-limit responses so a complete 128-row run stays
within the free-tier rolling quota. Pass `--force` to regenerate every vector.

Uploaded contract clauses must later use the same `gemini-embedding-2` model,
768 dimensions, task prefix, and category-aware formatter before cosine
comparison. Embeddings from different models or formatting strategies do not
share a comparable vector space.

## Clause analysis pipeline

Gemini 3.5 Flash segments extracted contract text into schema-constrained JSON.
Each clause is stored in document order, embedded with the exact baseline
formatter and `gemini-embedding-2` configuration, then compared only with
baseline vectors in the same category using pgvector cosine distance.

Similarity scores of 0.84 or higher are `safe`, scores from 0.72 to 0.84 are
`caution`, and lower scores or missing category matches are `risky`. Narrow
rules also catch clearly one-sided terms such as unlimited revisions, unlimited
liability, client-only discretionary acceptance, and an explicit waiver of a
kill fee. This matters because semantic embeddings can recognize the topic of
an unfair clause while missing that its legal effect is the opposite of a fair
baseline.

The document score is the specified weighted total: `risky = 3`, `caution = 1`,
and `safe = 0`. See the [analysis pipeline documentation](docs/analysis-pipeline.md)
for schema, edge cases, and design rationale.

After scoring, only `caution` and `risky` clauses are sent to Gemini for a
two-sentence explanation. The model receives the uploaded clause and its exact
closest fair baseline, and must return separate structured sentences for the
baseline norm and the specific deviation. `Uncategorized` clauses receive a
no-baseline explanation and a recommendation for manual or professional review.
Safe clauses skip this call and keep `explanation = NULL`.

Run the three realistic sample contracts against Gemini and PostgreSQL with:

```bash
pnpm test:samples
```

These clauses are comparison data for product development, not legal advice or
a substitute for jurisdiction-specific review by a qualified lawyer. See the
[baseline methodology](docs/baseline-methodology.md) for the research basis and
design rationale.

Run the current checks with:

```bash
pnpm test
pnpm build
```

To build and start the containerized frontend, API, and PostgreSQL:

```bash
docker compose up --build
```

The development password in `compose.yaml` is intentionally local-only. Use managed secrets for deployed environments.

## Current boundary

The foundation, managed authentication, document upload/text extraction, fair-clause baseline, clause segmentation, similarity-based risk labeling, and grounded flagged-clause explanations are implemented. Contract history and the full results UI belong to later numbered build items.

The following are roadmap features and are intentionally excluded from the MVP: TypeScript, a mobile app, payment integration, a support chatbot, contract comparison, report export, and non-freelance contract types.
