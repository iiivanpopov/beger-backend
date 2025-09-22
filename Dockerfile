FROM oven/bun:alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build:prod

FROM base AS prod-deps
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

FROM oven/bun:alpine AS runtime
RUN apk add --no-cache dumb-init

WORKDIR /app

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY drizzle ./drizzle
COPY drizzle.config.ts ./

USER bun
EXPOSE 5333

ENTRYPOINT ["dumb-init", "./entrypoint.sh"]