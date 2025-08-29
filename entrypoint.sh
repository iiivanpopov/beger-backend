#!/bin/sh
set -e

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"; }

wait_for_db() {
  log "Waiting for database at $DB_HOST:$DB_PORT..."
  attempt=0
  while [ $attempt -lt 60 ]; do
    if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
      if bun -e "
        import { Pool } from 'pg';
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        try { await pool.query('SELECT 1'); await pool.end(); process.exit(0); } 
        catch(e){ await pool.end(); process.exit(1); }
      "; then
        log "Database ready"
        return
      fi
    fi
    attempt=$((attempt + 1))
    sleep 3
  done
  log "ERROR: Database not ready"; exit 1
}

run_migrations() {
  log "Running migrations..."
  bun run db:migrate
  log "Migrations completed"
}

start_app() {
  log "Starting application..."
  exec bun start
}

main() {
  log "Starting backend..."
  wait_for_db
  run_migrations
  start_app
}

main "$@"
