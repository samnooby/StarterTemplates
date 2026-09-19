#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"
command="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"
[ -z "$command" ] && exit 0

block() {
  printf 'Blocked by sam-workflow guard: %s\n' "$1" >&2
  exit 2
}

if printf '%s' "$command" | grep -qE -- '(^|[[:space:]])git[[:space:]].*--no-verify'; then
  block "--no-verify is never allowed. Fix what the hook is complaining about."
fi

if printf '%s' "$command" | grep -qE -- '(^|[[:space:]])git[[:space:]]+push[[:space:]].*(--force|-f([[:space:]]|$)|--force-with-lease)' \
   && printf '%s' "$command" | grep -qE -- '(^|[[:space:]:])(main|master)([[:space:]]|$)'; then
  block "force-pushing to main/master is never allowed."
fi

if printf '%s' "$command" | grep -qE -- '(^|[[:space:]])rm[[:space:]]+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)[[:space:]]+("?~"?|/|\$HOME|\.|\*)([[:space:]]|$|/[[:space:]]|/$)'; then
  block "rm -rf of the home, root, current directory or a bare glob is never allowed."
fi

if printf '%s' "$command" | grep -qE -- '(^|[[:space:]])git[[:space:]]+(checkout|switch)[[:space:]]+(main|master)([[:space:]]|$)' \
   && printf '%s' "$command" | grep -qE -- '&&[[:space:]]*git[[:space:]]+commit'; then
  block "committing directly on main/master is never allowed. Create a branch."
fi

exit 0
