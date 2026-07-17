FROM node:24-alpine AS source

WORKDIR /source
COPY . .

# Render uses backend/ as its context, while the historical local command used
# the repository root. Normalize either layout to one standalone API directory.
RUN mkdir /normalized && \
  if [ -d /source/backend/src ]; then \
    cp -R /source/backend/. /normalized/; \
  else \
    cp -R /source/. /normalized/; \
  fi

FROM node:24-alpine AS dependencies

WORKDIR /app
RUN corepack enable

COPY --from=source /normalized/package.json /normalized/pnpm-lock.yaml /normalized/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM node:24-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=source --chown=node:node /normalized/. .

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/api/health').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"

CMD ["node", "src/server.js"]
