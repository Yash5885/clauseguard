# Clause Guard production deployment

This guide deploys the React/Vite frontend to Vercel and the Express API plus
PostgreSQL/pgvector to either Render or Railway. Choose one backend provider;
do not create databases on both.

## Production architecture

```text
Browser -> Vercel (React) -> Render/Railway (Express) -> PostgreSQL + pgvector
                                |                     -> Gemini API
                                +-------------------- -> Clerk Backend API
```

The API creates the pgvector extension and application tables on startup. A new
database still needs the fair-clause seed and embedding commands described
below.

## Values to collect before deploying

Create or copy these values first and keep secret values out of Git:

1. A PostgreSQL connection string from Render or Railway.
2. A Gemini API key from Google AI Studio.
3. A matching Clerk publishable key and secret key from one Clerk instance.
4. The backend public URL after the API deploys.
5. The frontend public URL after the Vercel project deploys.

For an initial staging deploy, the existing Clerk development instance can be
used. Before a real public launch, create a Clerk production instance, configure
its domain, and replace both frontend and backend keys together. Clerk production
publishable and secret keys normally start with `pk_live_` and `sk_live_`.

## Environment variables

### Vercel frontend

Set these in **Vercel project -> Settings -> Environment Variables**. Both are
build-time values; redeploy after changing either one.

| Variable | Value |
| --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key from the same instance used by the API |
| `VITE_API_BASE_URL` | Public backend origin, for example `https://clauseguard-api.onrender.com` or `https://clauseguard-api.up.railway.app`; no trailing slash and no `/api` suffix |

`VITE_` variables are included in the browser bundle. Never put the Clerk secret
or Gemini key in a `VITE_` variable.

### Render/Railway backend

Set these on the backend service at runtime:

| Variable | Required value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Provider connection string; prefer its private/internal URL |
| `DATABASE_SSL` | `false` for a provider-private connection; `true` when the selected connection requires TLS |
| `CORS_ALLOWED_ORIGINS` | Exact Vercel/custom frontend origin. Multiple exact origins can be comma-separated. Do not use `*` |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key matching the frontend key |
| `CLERK_SECRET_KEY` | Clerk secret key from that same instance |
| `GEMINI_API_KEY` | Google AI Studio Gemini API key |
| `GEMINI_EMBEDDING_MODEL` | `gemini-embedding-2` |
| `GEMINI_SEGMENTATION_MODEL` | `gemini-3.5-flash` |
| `GEMINI_EXPLANATION_MODEL` | `gemini-3.5-flash` |
| `GEMINI_GENERATION_FALLBACK_MODEL` | `gemini-3.1-flash-lite` |

Do not set `PORT` in production. Render and Railway inject it, and the server
already reads `process.env.PORT`.

## Option A: Render database and backend

### 1. Create PostgreSQL

1. In Render, choose **New -> PostgreSQL**.
2. Put the database in the same region as the future API service.
3. After it is ready, copy its **Internal Database URL**.
4. Open the Render database shell/PSQL command and run:

   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

Render supports pgvector and names the extension `vector`. The backend also
runs this statement on startup, but running it now confirms the selected
database supports the required extension before the API deploy.

### 2. Deploy the Express API

1. Choose **New -> Web Service** and connect this GitHub repository.
2. Select the production branch (normally `main`).
3. Select the **Docker** runtime.
4. Set **Root Directory** to `backend`. Render will use `backend/` as the build
   context and automatically find its `Dockerfile`.
5. Set the health check path to `/api/health`.
6. Add every backend variable from the table above. Use Render's Internal
   Database URL for `DATABASE_URL` and `false` for `DATABASE_SSL`.
7. If the Vercel URL is not known yet, omit `CORS_ALLOWED_ORIGINS` for this first
   deploy. Production CORS then fails closed, while health checks still work.
8. Deploy and copy the resulting `https://...onrender.com` URL.

Verify:

```text
https://YOUR-RENDER-SERVICE.onrender.com/api/health
https://YOUR-RENDER-SERVICE.onrender.com/api/health/database
```

The database health response must report `vector_enabled: true`.

## Option B: Railway pgvector database and backend

### 1. Create PostgreSQL with pgvector

Railway's standard PostgreSQL service does not include pgvector. In a new
Railway project, deploy Railway's **Postgres with pgvector** template instead.
Confirm it has a persistent volume, then copy/reference its private
`DATABASE_URL` from the Variables tab.

Once it is running, connect to it and verify:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
SELECT extname FROM pg_extension WHERE extname = 'vector';
```

### 2. Deploy the Express API

1. In the same Railway project, add a service from this GitHub repository.
2. Set the service **Root Directory** to `backend`; Railway will use that
   directory as the build context and find `backend/Dockerfile` there.
3. Set `/api/health` as the health check path.
4. Add every backend environment variable listed above. Reference the pgvector
   service's private database URL when possible.
5. Use `DATABASE_SSL=false` for a private connection. If the template only
   exposes an SSL-enforced/public URL, use that URL and set `DATABASE_SSL=true`.
6. Generate a public domain for the API, deploy it, and copy the resulting
   `https://...up.railway.app` URL.

Verify both `/api/health` and `/api/health/database` as shown in the Render
section.

## Initialize the production baseline

After the first successful backend start, open a shell for the deployed API
service. Its environment already contains the production `DATABASE_URL` and
`GEMINI_API_KEY`. Run:

```bash
node scripts/seedBaselineClauses.js
node scripts/generateBaselineEmbeddings.js
```

Both commands are idempotent. The first inserts the 128 fair baseline clauses;
the second creates any missing 768-dimensional Gemini embeddings. Confirm the
embedding script reports that all 128 rows have vectors before accepting
production uploads.

## Deploy the frontend to Vercel

1. In Vercel, choose **Add New -> Project** and import this GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Confirm Framework Preset is **Vite**.
4. Use `pnpm build` as the Build Command and `dist` as the Output Directory.
   Vercel should detect pnpm from the repository's root lockfile.
5. Add the two Vercel variables listed above. Set `VITE_API_BASE_URL` to the
   public backend URL copied from Render/Railway.
6. Deploy. `frontend/vercel.json` preserves client-side routes such as
   `/sign-in`, `/sign-up`, and `/dashboard` on direct navigation.
7. Copy the stable production Vercel URL (or attach the custom domain you intend
   to use).

## Complete CORS and Clerk configuration

1. Return to the backend service and set:

   ```text
   CORS_ALLOWED_ORIGINS=https://YOUR-PROJECT.vercel.app
   ```

   For a custom domain plus the Vercel domain, use:

   ```text
   CORS_ALLOWED_ORIGINS=https://clauseguard.example,https://YOUR-PROJECT.vercel.app
   ```

2. Redeploy/restart the backend so it reads the new allowlist.
3. In Clerk, configure the deployed frontend domain and its allowed redirect
   URLs. For a true production launch, use Clerk production keys and the custom
   domain configured for that Clerk production instance.
4. If any Vercel environment value changed, redeploy the frontend because Vite
   embeds those values at build time.

## Production smoke test

1. Open the Vercel URL in a private browser window.
2. Sign up or sign in and verify `/dashboard` loads.
3. Upload one valid PDF or DOCX under 10 MB.
4. Confirm the document moves from `processing` to `complete` and clause cards
   appear.
5. Check that the review appears in history after a refresh.
6. Sign out and confirm `/dashboard` redirects to `/sign-in`.
7. Check backend logs for CORS, Clerk, Gemini, or database errors.

## Rollback and secret hygiene

- Never commit `.env`; it is ignored by Git and excluded from Docker contexts.
- Rotate any key that is accidentally exposed and redeploy both services that
  use it.
- Keep Render/Railway automatic deploys on `main`, and use the provider's prior
  successful deploy/image for rollback.
- Back up production PostgreSQL before schema or embedding-model migrations.

## References

- [Render-supported PostgreSQL extensions](https://render.com/docs/postgresql-extensions)
- [Render Node/Express deployment](https://render.com/docs/deploy-node-express-app)
- [Railway pgvector guide](https://docs.railway.com/guides/rag-pipeline-pgvector)
- [Vercel monorepo setup](https://vercel.com/docs/monorepos)
- [Vercel Vite deployment](https://vercel.com/docs/frameworks/frontend/vite)
- [Clerk production deployment](https://clerk.com/docs/guides/development/deployment/production)
