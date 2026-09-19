#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"
file="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')"
[ -z "$file" ] || [ ! -f "$file" ] && exit 0

project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"

run_prettier() {
  local prettier="${project_dir}/node_modules/.bin/prettier"
  [ -x "$prettier" ] || return 0
  "$prettier" --write --log-level warn "$file" >/dev/null 2>&1 || true
}

run_ruff() {
  if [ -x "${project_dir}/.venv/bin/ruff" ]; then
    "${project_dir}/.venv/bin/ruff" format --quiet "$file" >/dev/null 2>&1 || true
    "${project_dir}/.venv/bin/ruff" check --quiet --fix --select I "$file" >/dev/null 2>&1 || true
  elif command -v ruff >/dev/null 2>&1; then
    ruff format --quiet "$file" >/dev/null 2>&1 || true
    ruff check --quiet --fix --select I "$file" >/dev/null 2>&1 || true
  fi
}

case "$file" in
  *.ts|*.tsx|*.mts|*.cts|*.js|*.jsx|*.mjs|*.cjs|*.json|*.css|*.scss|*.md|*.mdx|*.yaml|*.yml|*.html)
    run_prettier ;;
  *.py|*.pyi)
    run_ruff ;;
esac

exit 0
