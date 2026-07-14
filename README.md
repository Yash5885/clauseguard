# ClauseGuard

ClauseGuard is a desktop-first web application for clause-by-clause risk reviews of freelance contracts. This repository currently contains Section 8, item 1 of the MVP specification: the project foundation.

## Stack

- Frontend: React (JavaScript), Vite, and Tailwind CSS
- API: Node.js and Express
- Database: PostgreSQL with pgvector
- Local infrastructure: Docker Compose
- AI provider: OpenAI, configured later through environment variables
- Authentication: managed auth, added in build item 2

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
pnpm install
docker compose up -d database
pnpm dev
```

Open `http://localhost:5173`. The API health endpoints are available at:

- `GET http://localhost:3000/api/health`
- `GET http://localhost:3000/api/health/database`

Run the current checks with:

```bash
pnpm test
pnpm build
```

To build and start the containerized API with PostgreSQL:

```bash
docker compose up --build
```

The development password in `compose.yaml` is intentionally local-only. Use managed secrets for deployed environments.

## Current boundary

Only the foundation is implemented. Authentication, uploads, AI analysis, the contract history, and the full results UI belong to later numbered build items.

The following are roadmap features and are intentionally excluded from the MVP: TypeScript, a mobile app, payment integration, a support chatbot, contract comparison, report export, and non-freelance contract types.
