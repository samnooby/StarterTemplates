import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { deepEqual, isSubset, printReport, readSpecPath, truncate, type CheckResult } from './report.js';

const Json = z.json();

const Expectation = z.object({
  status: z.number().int().optional(),
  headers: z.record(z.string(), z.string()).optional(),
  body: Json.optional(),
  bodyIncludes: Json.optional(),
  bodyText: z.string().optional(),
});

const Request = z.object({
  name: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']).default('GET'),
  path: z.string(),
  headers: z.record(z.string(), z.string()).default({}),
  body: Json.optional(),
  expect: Expectation,
});

const Spec = z.object({
  baseUrl: z.url(),
  requests: z.array(Request).min(1),
});

type Request = z.infer<typeof Request>;
type Expectation = z.infer<typeof Expectation>;

async function main(): Promise<void> {
  const specPath = readSpecPath(process.argv);
  const spec = Spec.parse(JSON.parse(await readFile(specPath, 'utf8')));
  const results: CheckResult[] = [];
  for (const request of spec.requests) {
    results.push(await probe(spec.baseUrl, request));
  }
  const allPassed = printReport(`http-probe ${specPath}`, results);
  process.exitCode = allPassed ? 0 : 1;
}

async function probe(baseUrl: string, request: Request): Promise<CheckResult> {
  const url = new URL(request.path, baseUrl);
  const headers = new Headers(request.headers);
  const hasBody = request.body !== undefined;
  if (hasBody && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }
  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body: hasBody ? JSON.stringify(request.body) : null,
    });
    const text = await response.text();
    const failures = mismatches(request.expect, response, text);
    return {
      name: request.name,
      passed: failures.length === 0,
      detail: failures.length === 0 ? `${response.status}` : failures.join('; '),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { name: request.name, passed: false, detail: `request failed: ${message}` };
  }
}

function mismatches(expect: Expectation, response: Response, text: string): string[] {
  const failures: string[] = [];
  if (expect.status !== undefined && response.status !== expect.status) {
    failures.push(`status ${response.status}, expected ${expect.status}`);
  }
  for (const [name, expectedValue] of Object.entries(expect.headers ?? {})) {
    const actualValue = response.headers.get(name) ?? '';
    if (!actualValue.includes(expectedValue)) {
      failures.push(`header ${name} is "${actualValue}", expected to include "${expectedValue}"`);
    }
  }
  if (expect.bodyText !== undefined && !text.includes(expect.bodyText)) {
    failures.push(`body does not include "${expect.bodyText}": ${truncate(text)}`);
  }
  if (expect.body !== undefined || expect.bodyIncludes !== undefined) {
    const parsed = parseJson(text);
    if (parsed === undefined) {
      failures.push(`body is not JSON: ${truncate(text)}`);
    } else {
      if (expect.body !== undefined && !deepEqual(expect.body, parsed)) {
        failures.push(`body ${truncate(text)} does not equal ${JSON.stringify(expect.body)}`);
      }
      if (expect.bodyIncludes !== undefined && !isSubset(expect.bodyIncludes, parsed)) {
        failures.push(`body ${truncate(text)} does not include ${JSON.stringify(expect.bodyIncludes)}`);
      }
    }
  }
  return failures;
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

await main();
