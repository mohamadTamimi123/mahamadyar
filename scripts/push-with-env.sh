#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"

load_env_file() {
  local env_file="$1"
  if [[ -f "$env_file" ]]; then
    # shellcheck disable=SC2046
    export $(grep -E '^[A-Z0-9_]+=' "$env_file" | xargs -0 -I{} bash -c 'echo {}' || true)
  fi
}

# Load env from root .env, then fallback to nestjs-api/.env
load_env_file "$ROOT_DIR/.env"
load_env_file "$ROOT_DIR/nestjs-api/.env"

: "${GIT_ORIGIN?GIT_ORIGIN is required in .env}"
GIT_BRANCH="${GIT_BRANCH:-master}"

echo "Using origin: $GIT_ORIGIN"
echo "Using branch: $GIT_BRANCH"

cd "$ROOT_DIR"

if ! git remote | grep -q '^origin$'; then
  echo "Adding remote origin..."
  git remote add origin "$GIT_ORIGIN" || true
fi

# Configure upstream if missing
if ! git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then
  echo "Setting upstream to origin/$GIT_BRANCH..."
  git branch --set-upstream-to "origin/$GIT_BRANCH" master || true
fi

echo "Pulling latest with autostash..."
git pull --autostash || true

echo "Pushing to $GIT_ORIGIN $GIT_BRANCH..."
git push -u origin "$GIT_BRANCH"

echo "Done."


