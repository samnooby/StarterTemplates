#!/usr/bin/env bash
set -euo pipefail

dir="${1:-.}"
cd "$dir"

has_dep() {
  [ -f package.json ] && jq -e --arg name "$1" '(.dependencies // {})[$name] // (.devDependencies // {})[$name]' package.json >/dev/null 2>&1
}

has_py_dep() {
  [ -f pyproject.toml ] && grep -qiE "^\s*\"?${1}[\"[>=<~ ]" pyproject.toml
}

script_or() {
  local name="$1" fallback="$2"
  if [ -f package.json ] && jq -e --arg name "$name" '.scripts[$name]' package.json >/dev/null 2>&1; then
    printf '%s run %s' "$(pkg_manager)" "$name"
  else
    printf '%s' "$fallback"
  fi
}

pkg_manager() {
  if [ -f pnpm-lock.yaml ]; then printf 'pnpm'
  elif [ -f yarn.lock ]; then printf 'yarn'
  elif [ -f bun.lockb ] || [ -f bun.lock ]; then printf 'bun'
  else printf 'npm'
  fi
}

emit() {
  printf 'harness=%s\nstart=%s\nport=%s\n' "$1" "$2" "$3"
}

if [ -f app.json ] && has_dep expo; then
  emit mobile "CI=1 $(pkg_manager) exec expo start --web --port 8081" 8081
elif has_dep next; then
  emit web "$(script_or dev 'npx next dev')" 3000
elif has_dep vite; then
  emit web "$(script_or dev 'npx vite') --port 5173 --strictPort" 5173
elif has_dep express || has_dep fastify || has_dep hono || has_dep koa || has_dep '@nestjs/core'; then
  emit http "$(script_or dev "$(script_or start 'node .')")" 3000
elif has_py_dep fastapi; then
  emit http "uv run uvicorn --factory --port 8000 \$(grep -oE '[a-z_./]+:app' README.md 2>/dev/null | head -1)" 8000
elif has_py_dep flask; then
  emit http "uv run flask run --port 5000" 5000
elif has_py_dep django; then
  emit http "uv run python manage.py runserver 8000" 8000
elif [ -f pyproject.toml ] && grep -qE '^\[project\.scripts\]' pyproject.toml; then
  emit cli "uv run $(sed -n '/^\[project\.scripts\]/,/^\[/p' pyproject.toml | grep -oE '^[a-zA-Z0-9_-]+' | head -1)" ''
elif [ -f package.json ] && jq -e '.bin' package.json >/dev/null 2>&1; then
  emit cli "$(pkg_manager) exec $(jq -r 'if (.bin|type)=="string" then .name else (.bin|keys[0]) end' package.json)" ''
else
  emit unknown '' ''
fi
