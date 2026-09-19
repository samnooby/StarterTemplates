#!/usr/bin/env bash
set -euo pipefail

rules_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../rules" && pwd)"

strip_frontmatter() {
  awk 'NR == 1 && /^---$/ { in_frontmatter = 1; next }
       in_frontmatter && /^---$/ { in_frontmatter = 0; next }
       !in_frontmatter'
}

for name in general git testing typescript react python; do
  strip_frontmatter < "${rules_dir}/${name}.md"
  printf '\n'
done
