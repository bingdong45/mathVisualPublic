#!/usr/bin/env bash
set -e

# ── Check Docker ──────────────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  echo "Error: Docker is not installed. Install it from https://docs.docker.com/get-docker/ and try again."
  exit 1
fi

# Support both `docker compose` (v2) and `docker-compose` (v1)
if docker compose version &>/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v docker-compose &>/dev/null; then
  COMPOSE="docker-compose"
else
  echo "Error: Docker Compose not found. Install Docker Desktop or the compose plugin."
  exit 1
fi

# ── Create .env from template ─────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  cp "$SCRIPT_DIR/.env.example" "$ENV_FILE"
  echo "Created .env from .env.example"

  # Prompt for required secrets
  read -rp "Enter your Anthropic API key: " api_key
  if [ -n "$api_key" ]; then
    sed -i.bak "s|your_anthropic_api_key_here|$api_key|" "$ENV_FILE" && rm -f "$ENV_FILE.bak"
  fi

  read -rp "Enter a JWT secret (press Enter to use default 'dev-secret-change-me'): " jwt_secret
  if [ -n "$jwt_secret" ]; then
    sed -i.bak "s|change-me-in-production|$jwt_secret|" "$ENV_FILE" && rm -f "$ENV_FILE.bak"
  fi

  echo ""
else
  echo ".env already exists — skipping creation."
fi

# ── Launch ────────────────────────────────────────────────────────────────────
echo ""
echo "Building and starting services (this may take a few minutes on first run)..."
echo ""

cd "$SCRIPT_DIR"
$COMPOSE up --build

