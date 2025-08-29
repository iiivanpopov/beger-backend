FROM oven/bun:alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app

RUN addgroup --system --gid 1001 bunuser && \
    adduser --system --uid 1001 bunuser

FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM base AS prod-deps
COPY package.json bun.lockb* ./
RUN bun install --production --frozen-lockfile

FROM oven/bun:alpine AS runtime
RUN apk add --no-cache dumb-init && \
    addgroup --system --gid 1001 bunuser && \
    adduser --system --uid 1001 bunuser

WORKDIR /app

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

RUN bun i drizzle-kit

RUN mkdir -p /app/logs && chown -R bunuser:bunuser /app/logs

COPY --from=prod-deps --chown=bunuser:bunuser /app/node_modules ./node_modules
COPY --from=builder --chown=bunuser:bunuser /app/dist ./dist
COPY --chown=bunuser:bunuser package.json ./
COPY --chown=bunuser:bunuser drizzle ./drizzle
COPY --chown=bunuser:bunuser drizzle.config.ts ./

USER bunuser
EXPOSE 5333

ENTRYPOINT ["dumb-init", "./entrypoint.sh"]