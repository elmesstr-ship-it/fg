#!/usr/bin/env bash
# ==============================================================================
# SANCTA MARIA - PRODUCTION DATABASE BACKUP & RESTORE UTILITY
# ==============================================================================
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/sanctamaria}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="sanctamaria_db_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

mkdir -p "${BACKUP_DIR}"

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

case "${1:-backup}" in
  backup)
    log "Initiating PostgreSQL production database backup..."
    if [ -z "${DATABASE_URL:-}" ]; then
      echo "ERROR: DATABASE_URL is not set"
      exit 1
    fi

    pg_dump "${DATABASE_URL}" --clean --if-exists --no-owner --no-privileges | gzip > "${BACKUP_DIR}/${FILENAME}"
    log "Backup successfully saved to ${BACKUP_DIR}/${FILENAME}"

    # Calculate size and checksum
    FILESIZE=$(du -h "${BACKUP_DIR}/${FILENAME}" | cut -f1)
    CHECKSUM=$(sha256sum "${BACKUP_DIR}/${FILENAME}" | cut -d' ' -f1)
    log "Backup Size: ${FILESIZE} | SHA256: ${CHECKSUM}"

    # Optional S3 offsite replication
    if command -v aws &> /dev/null && [ -n "${BACKUP_S3_BUCKET:-}" ]; then
      log "Uploading backup to AWS S3 bucket: s3://${BACKUP_S3_BUCKET}/backups/${FILENAME}..."
      aws s3 cp "${BACKUP_DIR}/${FILENAME}" "s3://${BACKUP_S3_BUCKET}/backups/${FILENAME}" --storage-class STANDARD_IA
      log "Offsite replication completed."
    fi

    # Housekeeping: delete backups older than retention days
    log "Pruning local backup archives older than ${RETENTION_DAYS} days..."
    find "${BACKUP_DIR}" -type f -name "sanctamaria_db_*.sql.gz" -mtime +"${RETENTION_DAYS}" -delete
    log "Backup routine completed successfully."
    ;;

  restore)
    RESTORE_FILE="${2:-}"
    if [ -z "${RESTORE_FILE}" ] || [ ! -f "${RESTORE_FILE}" ]; then
      echo "ERROR: Please specify a valid backup file to restore."
      echo "Usage: ./backup.sh restore /path/to/sanctamaria_db_YYYYMMDD_HHMMSS.sql.gz"
      exit 1
    fi

    read -p "WARNING: This will overwrite the current database! Are you sure? (type 'CONFIRM'): " CONFIRMATION
    if [ "${CONFIRMATION}" != "CONFIRM" ]; then
      echo "Restore aborted."
      exit 0
    fi

    log "Restoring database from ${RESTORE_FILE}..."
    gunzip -c "${RESTORE_FILE}" | psql "${DATABASE_URL}"
    log "Database restore completed successfully."
    ;;

  *)
    echo "Usage: $0 {backup|restore <file>}"
    exit 1
    ;;
esac
