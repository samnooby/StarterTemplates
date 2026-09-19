#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat >&2 <<'USAGE'
usage: with-app.sh [--cwd DIR] [--port PORT] [--ready-pattern REGEX] [--timeout SECONDS] --start "CMD" --check "CMD"

Starts CMD in its own process group, waits until PORT accepts connections or the
app log matches REGEX, runs the check command, then stops the app. Exit code is
the check command's exit code. Logs are kept under $TMPDIR/with-app.<pid>/.
USAGE
  exit 64
}

cwd="$(pwd)"
port=""
ready_pattern=""
timeout=60
start=""
check=""

while [ $# -gt 0 ]; do
  case "$1" in
    --cwd) cwd="$2"; shift 2 ;;
    --port) port="$2"; shift 2 ;;
    --ready-pattern) ready_pattern="$2"; shift 2 ;;
    --timeout) timeout="$2"; shift 2 ;;
    --start) start="$2"; shift 2 ;;
    --check) check="$2"; shift 2 ;;
    *) usage ;;
  esac
done

[ -n "$start" ] && [ -n "$check" ] || usage
[ -n "$port" ] || [ -n "$ready_pattern" ] || usage

log_dir="$(mktemp -d "${TMPDIR:-/tmp}/with-app.XXXXXX")"
app_log="${log_dir}/app.log"

port_open() {
  [ -n "$port" ] && (exec 3<>"/dev/tcp/127.0.0.1/${port}") 2>/dev/null
}

log_ready() {
  [ -n "$ready_pattern" ] && grep -qE -- "$ready_pattern" "$app_log" 2>/dev/null
}

stop_app() {
  if [ -n "${app_pid:-}" ] && kill -0 "$app_pid" 2>/dev/null; then
    kill -TERM -- "-${app_pid}" 2>/dev/null || kill -TERM "$app_pid" 2>/dev/null || true
    for _ in 1 2 3 4 5 6 7 8 9 10; do
      kill -0 "$app_pid" 2>/dev/null || break
      sleep 0.5
    done
    kill -KILL -- "-${app_pid}" 2>/dev/null || kill -KILL "$app_pid" 2>/dev/null || true
  fi
}

trap stop_app EXIT

if port_open; then
  printf 'with-app: port %s is already in use; refusing to start "%s"\n' "$port" "$start" >&2
  exit 65
fi

(cd "$cwd" && exec setsid bash -c "$start" >"$app_log" 2>&1) &
app_pid=$!

printf 'with-app: started "%s" (pid %s), log %s\n' "$start" "$app_pid" "$app_log" >&2

waited=0
until port_open || log_ready; do
  if ! kill -0 "$app_pid" 2>/dev/null; then
    printf 'with-app: app exited before becoming ready. Last log lines:\n' >&2
    tail -n 30 "$app_log" >&2
    exit 66
  fi
  if [ "$waited" -ge "$timeout" ]; then
    printf 'with-app: not ready after %ss. Last log lines:\n' "$timeout" >&2
    tail -n 30 "$app_log" >&2
    exit 67
  fi
  sleep 1
  waited=$((waited + 1))
done

printf 'with-app: ready after %ss, running check\n' "$waited" >&2

set +e
(cd "$cwd" && bash -c "$check")
check_status=$?
set -e

if [ "$check_status" -ne 0 ]; then
  printf 'with-app: check failed (exit %s). Last app log lines:\n' "$check_status" >&2
  tail -n 30 "$app_log" >&2
fi

exit "$check_status"
