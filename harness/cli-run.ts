import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { z } from 'zod';
import { printReport, readSpecPath, truncate, type CheckResult } from './report.js';

const Expectation = z.object({
  exitCode: z.number().int().default(0),
  stdout: z.string().optional(),
  stdoutIncludes: z.string().optional(),
  stderrIncludes: z.string().optional(),
});

const Case = z.object({
  name: z.string(),
  command: z.tuple([z.string()], z.string()),
  stdin: z.string().default(''),
  env: z.record(z.string(), z.string()).default({}),
  timeoutMs: z.number().int().positive().default(30_000),
  expect: Expectation,
});

const Spec = z.object({
  cwd: z.string().default('.'),
  cases: z.array(Case).min(1),
});

type Case = z.infer<typeof Case>;

interface Outcome {
  readonly exitCode: number | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly timedOut: boolean;
}

async function main(): Promise<void> {
  const specPath = readSpecPath(process.argv);
  const spec = Spec.parse(JSON.parse(await readFile(specPath, 'utf8')));
  const cwd = resolve(dirname(specPath), spec.cwd);
  const results: CheckResult[] = [];
  for (const testCase of spec.cases) {
    results.push(await run(cwd, testCase));
  }
  const allPassed = printReport(`cli-run ${specPath}`, results);
  process.exitCode = allPassed ? 0 : 1;
}

async function run(cwd: string, testCase: Case): Promise<CheckResult> {
  const outcome = await execute(cwd, testCase);
  const failures = mismatches(testCase, outcome);
  return {
    name: testCase.name,
    passed: failures.length === 0,
    detail: failures.length === 0 ? `exit ${outcome.exitCode}` : failures.join('; '),
  };
}

function execute(cwd: string, testCase: Case): Promise<Outcome> {
  const [command, ...args] = testCase.command;
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, ...testCase.env },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, testCase.timeoutMs);
    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      resolvePromise({ exitCode: null, stdout, stderr: `${stderr}${error.message}`, timedOut });
    });
    child.on('close', (exitCode) => {
      clearTimeout(timer);
      resolvePromise({ exitCode, stdout, stderr, timedOut });
    });
    child.stdin.on('error', () => undefined);
    child.stdin.end(testCase.stdin);
  });
}

function mismatches(testCase: Case, outcome: Outcome): string[] {
  const failures: string[] = [];
  if (outcome.timedOut) {
    failures.push(`timed out after ${testCase.timeoutMs}ms`);
  }
  if (outcome.exitCode !== testCase.expect.exitCode) {
    failures.push(`exit ${outcome.exitCode}, expected ${testCase.expect.exitCode}`);
  }
  if (testCase.expect.stdout !== undefined && outcome.stdout !== testCase.expect.stdout) {
    failures.push(`stdout ${JSON.stringify(truncate(outcome.stdout))}, expected ${JSON.stringify(testCase.expect.stdout)}`);
  }
  if (testCase.expect.stdoutIncludes !== undefined && !outcome.stdout.includes(testCase.expect.stdoutIncludes)) {
    failures.push(`stdout ${JSON.stringify(truncate(outcome.stdout))} does not include ${JSON.stringify(testCase.expect.stdoutIncludes)}`);
  }
  if (testCase.expect.stderrIncludes !== undefined && !outcome.stderr.includes(testCase.expect.stderrIncludes)) {
    failures.push(`stderr ${JSON.stringify(truncate(outcome.stderr))} does not include ${JSON.stringify(testCase.expect.stderrIncludes)}`);
  }
  return failures;
}

await main();
