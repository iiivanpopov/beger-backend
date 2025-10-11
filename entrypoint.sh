#!/bin/sh
set -e

run_migrations() {
  echo "[INFO] Migrating database..."
  bun db:migrate
}

seed_database() {
  echo "[INFO] Seeding database..."
  bun seed:prod
}

start_app() {
  echo "[INFO] Starting application..."
  exec bun start:dist:prod
}

main() {
  echo "[INFO] Starting backend..."
  run_migrations
  seed_database
  start_app
}

main "$@"
