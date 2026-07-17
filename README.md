# Clause Guard

**AI-assisted, clause-by-clause risk review for freelance contracts.**

[Live Demo](https://clauseguard-frontend.vercel.app) | [How It Works](#how-it-works) | [Local Setup](#local-development) | [Deployment Guide](DEPLOYMENT.md)

Clause Guard helps freelancers and independent professionals understand contract terms before they sign. It converts dense PDF and DOCX agreements into categorized clauses, compares them with a curated set of fair freelance terms, and explains potential risks in plain language.

> Clause Guard is a decision-support tool, not a substitute for advice from a qualified legal professional.

## Live Demo

[**Launch Clause Guard**](https://clauseguard-frontend.vercel.app)

The public demo is a live, working Vercel deployment. Create an account, upload a PDF or DOCX freelance contract, and follow the review from extraction through clause-level results.

## Screenshots

### Landing page

<img width="1944" height="1292" alt="image" src="https://github.com/user-attachments/assets/6b807730-6ab3-4b2e-a822-aa2bfefc4bcc" />


### Dashboard

![Clause Guard dashboard](docs/screenshots/dashboard.png)

### Clause results

![Clause Guard clause results](docs/screenshots/clause-results.png)

The image paths above are ready for project screenshots to be added under `docs/screenshots/`.

## Key Features

- Managed sign-up, sign-in, sign-out, session handling, and protected routes with Clerk
- Authenticated PDF and DOCX uploads with file-type validation and a 10 MB size limit
- Server-side text extraction using `pdf-parse` and Mammoth
- Gemini-powered clause segmentation into eight freelance-contract categories, with an `Uncategorized` fallback
- Category-aware, 768-dimensional Gemini embeddings generated with one shared formatter for baseline and uploaded clauses
- Cosine-similarity search against 128 curated baseline clauses using PostgreSQL and pgvector
- Calibrated `safe`, `caution`, and `risky` labels, supplemented by deterministic checks for explicit one-sided terms
- Grounded, plain-language explanations for every caution or risky clause
- Asynchronous analysis with processing-state polling, graceful failure states, and transactional result storage
- Per-document overall risk scores and vertically stacked, color-coded clause result cards
- Searchable review history populated from the authenticated user's saved documents
- Responsive landing, authentication, dashboard, upload, processing, and results experiences

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router |
| Backend | Node.js 24, Express 5, Multer, `pdf-parse`, Mammoth |
| Database | PostgreSQL 17, pgvector, HNSW cosine indexes |
| AI / ML | Google Gemini structured generation, `gemini-embedding-2`, pgvector similarity search |
| Authentication | Clerk via `@clerk/react` and `@clerk/express` |
| Testing | Node.js test runner, Supertest |
| Deployment | Vercel, Render, Docker, Docker Compose, Nginx |

## How It Works

Clause Guard uses a staged pipeline so extraction, model output, vector comparison, and user-facing explanations remain independently testable.

1. **Upload and validate.** An authenticated user submits one PDF or DOCX file to the Express API. Multer keeps the file in memory, enforces the 10 MB limit, and rejects unsupported extensions, MIME types, empty files, and multiple-file requests before extraction starts.
2. **Extract and persist.** `pdf-parse` extracts PDF text and Mammoth extracts DOCX text. The backend creates a `documents` row containing the original text and returns a document ID with a `processing` status; the heavier analysis continues asynchronously while the dashboard polls for updates.
3. **Segment and categorize.** Gemini receives the contract as inert source material and returns structured JSON at temperature `0`. Each segment includes its original clause text, source order, and one supported category: Payment Terms, IP Rights, Termination, Liability, Revisions, Confidentiality, Kill Fee, or Late Payment Penalty. Clauses without a defensible match are retained as `Uncategorized` rather than forced into a misleading class.
4. **Create comparable embeddings.** Every categorized clause is formatted with the same category-aware sentence-similarity prefix used to embed the fair baseline corpus, then embedded with `gemini-embedding-2` at 768 dimensions. Keeping the model, dimension, task prefix, and formatter identical is essential: vectors produced under different embedding conditions are not valid inputs to the same similarity comparison.
5. **Find the nearest fair term.** PostgreSQL searches only baseline clauses in the same category and uses pgvector cosine distance to select the closest fair example. The baseline corpus contains 128 clauses—16 per supported category—and HNSW `vector_cosine_ops` indexes support efficient nearest-neighbor lookup.
6. **Assign risk.** A similarity score of at least `0.89` is normally safe, `0.82` to below `0.89` is caution, and anything below `0.82` is risky. Missing matches and uncategorized clauses are risky by default. A deterministic rule layer can also promote an apparently similar clause to caution or risky when it contains explicit one-sided language, because a harmful term can discuss the same subject as a fair baseline and still be semantically close to it.
7. **Calculate the document score.** Clause labels contribute weighted points—safe `0`, caution `1`, and risky `3`—to the document's overall risk score. This keeps the summary interpretable while preserving the individual evidence behind it.
8. **Explain flagged clauses.** Caution and risky clauses are sent to Gemini in batches with the uploaded text, the closest baseline clause, the similarity result, and the rule-based findings. Structured output is constrained to two plain-language sentences: what differs from the fair reference and why that difference matters. Safe clauses skip this stage, and uncategorized clauses receive a bounded manual-review note instead of invented legal analysis.

The backend writes the segmented clauses, vectors, matches, labels, and explanations transactionally. Successful analysis marks the document `complete`; a failed stage rolls back incomplete analysis data and records a safe, user-facing failure state.

## Architecture

```text
┌──────────────────────────────┐
│ React + Vite frontend        │
│ Vercel                       │
└──────────────┬───────────────┘
               │ Clerk session token + HTTPS API requests
               ▼
┌──────────────────────────────┐       ┌──────────────────────────┐
│ Express API                  │◄─────►│ Clerk                    │
│ Render                       │       │ Identity and token auth  │
└──────────┬───────────┬───────┘       └──────────────────────────┘
           │           │
           │           └──────────────► Google Gemini
           │                            Segmentation, embeddings,
           │                            grounded explanations
           ▼
┌──────────────────────────────┐
│ PostgreSQL + pgvector        │
│ Render                       │
│ Users, documents, clauses,   │
│ baselines, vectors, matches  │
└──────────────────────────────┘
```

The browser never receives Clerk secret keys, the Gemini API key, or database credentials. It sends Clerk-authenticated requests to Express, and the backend owns extraction, AI calls, scoring, and persistence.

## Local Development

### Prerequisites

- Node.js 24 or newer
- pnpm 11 or newer
- Docker Desktop with Docker Compose
- A Clerk application
- A Google Gemini API key

### 1. Clone and install

```bash
git clone https://github.com/Yash5885/clauseguard.git
cd clauseguard
pnpm install
```

### 2. Create the local environment file

On macOS or Linux:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Review `.env.example` and set the values required for your environment. Its local database defaults already target the Dockerized PostgreSQL service.

### 3. Start PostgreSQL with pgvector

```bash
docker compose up -d database
```

The database initialization scripts create the `vector` extension and the project tables automatically on a fresh volume.

### 4. Seed and embed the fair-clause corpus

```bash
pnpm seed:baselines
pnpm embed:baselines
```

The seed command is idempotent. The embedding command requires `GEMINI_API_KEY` and uses the same model and formatter as uploaded contract clauses.

### 5. Run the application

```bash
pnpm dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- API health: `http://localhost:3000/api/health`
- Database health: `http://localhost:3000/api/health/database`

To build and run the complete containerized stack instead:

```bash
docker compose up --build
```

### Useful Commands

```bash
pnpm build              # Build the frontend and validate backend source syntax
pnpm test               # Run backend tests
pnpm seed:baselines     # Insert or update the 128 fair baseline clauses
pnpm embed:baselines    # Generate and store baseline embeddings
pnpm test:samples       # Analyze the included sample contract fixtures
pnpm start              # Start the production backend process
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for the production Vercel and Render setup.

## Environment Variables

Copy `.env.example` to `.env` for local development. Do not commit `.env` or production credentials.

| Variable | Used by | Required | Description |
| --- | --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Frontend | Yes | Clerk publishable key exposed to the Vite client |
| `VITE_API_BASE_URL` | Frontend | Yes | Express origin, without a trailing slash or `/api` |
| `NODE_ENV` | Backend | Recommended | Runtime mode, normally `development`, `test`, or `production` |
| `PORT` | Backend | No | Express port; defaults to `3000` |
| `CORS_ALLOWED_ORIGINS` | Backend | Yes in production | Comma-separated frontend origins allowed to call the API |
| `DATABASE_URL` | Backend and scripts | Yes | PostgreSQL connection string |
| `DATABASE_SSL` | Backend and scripts | Production-dependent | Set to `true` when the hosted database requires TLS |
| `CLERK_PUBLISHABLE_KEY` | Backend | Yes | Server-side Clerk publishable key used by Clerk middleware |
| `CLERK_SECRET_KEY` | Backend | Yes | Secret Clerk key used to verify and retrieve user data |
| `GEMINI_API_KEY` | Backend and scripts | Yes | Google Gemini API credential for analysis and embeddings |
| `GEMINI_EMBEDDING_MODEL` | Backend and scripts | No | Embedding model; defaults to `gemini-embedding-2` |
| `GEMINI_SEGMENTATION_MODEL` | Backend | No | Primary segmentation model; defaults to `gemini-3.5-flash` |
| `GEMINI_EXPLANATION_MODEL` | Backend | No | Primary explanation model; defaults to `gemini-3.5-flash` |
| `GEMINI_GENERATION_FALLBACK_MODEL` | Backend | No | Fallback generation model; defaults to `gemini-3.1-flash-lite` |

Vite only exposes variables prefixed with `VITE_` to browser code. All secret values belong exclusively in the backend environment.

## Project Structure

```text
clauseguard/
├── frontend/
│   ├── src/
│   │   ├── components/       # Landing, auth, dashboard, upload, and clause UI
│   │   ├── config/           # Browser-safe runtime configuration
│   │   └── pages/            # Public, authentication, and protected routes
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── scripts/              # Baseline seeding, embedding, and sample analysis
│   ├── src/
│   │   ├── config/           # Database, Gemini, and model configuration
│   │   ├── data/             # Curated fair baseline clause corpus
│   │   ├── middleware/       # Clerk auth, upload validation, and errors
│   │   ├── routes/           # Health, user, upload, history, and result APIs
│   │   └── services/         # Extraction and the contract-analysis pipeline
│   ├── test/                 # Backend unit and integration tests
│   └── Dockerfile
├── database/
│   └── init/                 # PostgreSQL schema and pgvector initialization
├── docs/                     # Technical notes and future screenshot assets
├── compose.yaml              # Local multi-container environment
├── DEPLOYMENT.md             # Vercel and Render deployment guide
├── .env.example              # Safe configuration template
└── package.json              # Workspace scripts
```

## Roadmap

Coming soon:

- A contextual support chatbot for follow-up questions about completed reviews
- Side-by-side contract comparison and change tracking
- Paid tiers, usage limits, and billing workflows
- Additional document types and contract categories beyond freelance agreements
- Exportable and shareable review reports

## License

This repository does not currently include a license file. MIT is a practical default for a public portfolio project; add a root-level `LICENSE` file containing the MIT License if you want to formally grant those permissions.
