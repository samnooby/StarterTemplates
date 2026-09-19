export interface CheckResult {
  readonly name: string;
  readonly passed: boolean;
  readonly detail: string;
}

export function printReport(title: string, results: readonly CheckResult[]): boolean {
  const failed = results.filter((result) => !result.passed);
  const width = Math.max(...results.map((result) => result.name.length), 4);
  console.log(`\n${title}`);
  for (const result of results) {
    const mark = result.passed ? 'PASS' : 'FAIL';
    const detail = result.detail === '' ? '' : `  ${result.detail}`;
    console.log(`  ${mark}  ${result.name.padEnd(width)}${detail}`);
  }
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  return failed.length === 0;
}

export function readSpecPath(argv: readonly string[]): string {
  const specPath = argv[2];
  if (specPath === undefined) {
    throw new UsageError('usage: <driver> <spec.json>');
  }
  return specPath;
}

export class UsageError extends Error {
  override readonly name = 'UsageError';
}

export function isSubset(expected: unknown, actual: unknown): boolean {
  if (expected === null || typeof expected !== 'object') {
    return Object.is(expected, actual);
  }
  if (Array.isArray(expected)) {
    return (
      Array.isArray(actual) &&
      expected.length === actual.length &&
      expected.every((item, index) => isSubset(item, actual[index]))
    );
  }
  if (actual === null || typeof actual !== 'object' || Array.isArray(actual)) {
    return false;
  }
  const actualRecord = actual as Record<string, unknown>;
  return Object.entries(expected).every(([key, value]) => isSubset(value, actualRecord[key]));
}

export function truncate(text: string, max = 200): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  return isSubset(a, b) && isSubset(b, a);
}
