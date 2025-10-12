#!/bin/sh
set -e

bun run drizzle-kit migrate
bun run seed:prod

exec bun run dist:prod
