import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, type Locator, type Page } from 'playwright';
import { z } from 'zod';
import { printReport, readSpecPath, truncate, type CheckResult } from './report.js';

const Target = z.union([
  z.object({ role: z.string(), name: z.string() }),
  z.object({ label: z.string() }),
  z.object({ text: z.string() }),
  z.object({ testId: z.string() }),
  z.object({ selector: z.string() }),
]);

const Step = z.union([
  z.object({ goto: z.string() }),
  z.object({ click: Target }),
  z.object({ fill: Target.and(z.object({ value: z.string() })) }),
  z.object({ press: z.string() }),
  z.object({ expectText: z.string() }),
  z.object({ expectNoText: z.string() }),
  z.object({ expectVisible: Target }),
  z.object({ expectUrl: z.string() }),
  z.object({ expectTitle: z.string() }),
  z.object({ screenshot: z.string() }),
  z.object({ wait: z.number().int().positive() }),
]);

const Spec = z.object({
  baseUrl: z.url(),
  viewport: z.object({ width: z.number().int(), height: z.number().int() }).default({ width: 1280, height: 800 }),
  stepTimeoutMs: z.number().int().positive().default(10_000),
  allowConsoleErrors: z.array(z.string()).default([]),
  allowFailedRequests: z.array(z.string()).default([]),
  outDir: z.string().default('out'),
  steps: z.array(Step).min(1),
});

type Target = z.infer<typeof Target>;
type Step = z.infer<typeof Step>;
type Spec = z.infer<typeof Spec>;

class StepError extends Error {
  override readonly name = 'StepError';
}

async function main(): Promise<void> {
  const specPath = readSpecPath(process.argv);
  const spec = Spec.parse(JSON.parse(await readFile(specPath, 'utf8')));
  const outDir = resolve(spec.outDir);
  await mkdir(outDir, { recursive: true });

  const executablePath = process.env['PLAYWRIGHT_CHROMIUM_PATH'];
  const browser = await chromium.launch(executablePath === undefined ? {} : { executablePath });
  const page = await browser.newPage({ viewport: spec.viewport });
  page.setDefaultTimeout(spec.stepTimeoutMs);
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`));
  page.on('response', (response) => {
    if (response.status() >= 400) failedRequests.push(`${response.request().method()} ${response.url()} ${response.status()}`);
  });

  const results: CheckResult[] = [];
  try {
    for (const [index, step] of spec.steps.entries()) {
      results.push(await runStep(page, spec, step, index, outDir));
      if (!results.at(-1)?.passed) break;
    }
  } finally {
    await browser.close();
  }
  results.push(unexpectedEntries('console errors', consoleErrors, spec.allowConsoleErrors));
  results.push(unexpectedEntries('failed requests', failedRequests, spec.allowFailedRequests));

  const allPassed = printReport(`web-drive ${specPath}`, results);
  process.exitCode = allPassed ? 0 : 1;
}

async function runStep(page: Page, spec: Spec, step: Step, index: number, outDir: string): Promise<CheckResult> {
  const name = `${String(index + 1).padStart(2, '0')} ${describe(step)}`;
  try {
    await perform(page, spec, step, outDir);
    return { name, passed: true, detail: '' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const screenshotPath = resolve(outDir, `failure-step-${index + 1}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
    return { name, passed: false, detail: `${truncate(message.split('\n')[0] ?? message)} (screenshot: ${screenshotPath})` };
  }
}

async function perform(page: Page, spec: Spec, step: Step, outDir: string): Promise<void> {
  if ('goto' in step) {
    await page.goto(new URL(step.goto, spec.baseUrl).toString());
    return;
  }
  if ('click' in step) {
    await locate(page, step.click).click();
    return;
  }
  if ('fill' in step) {
    await locate(page, step.fill).fill(step.fill.value);
    return;
  }
  if ('press' in step) {
    await page.keyboard.press(step.press);
    return;
  }
  if ('expectText' in step) {
    await page.getByText(step.expectText, { exact: false }).first().waitFor({ state: 'visible' });
    return;
  }
  if ('expectNoText' in step) {
    const count = await page.getByText(step.expectNoText, { exact: false }).count();
    if (count > 0) throw new StepError(`text "${step.expectNoText}" is present`);
    return;
  }
  if ('expectVisible' in step) {
    await locate(page, step.expectVisible).waitFor({ state: 'visible' });
    return;
  }
  if ('expectUrl' in step) {
    await page.waitForURL((url) => url.toString().includes(step.expectUrl));
    return;
  }
  if ('expectTitle' in step) {
    const title = await page.title();
    if (!title.includes(step.expectTitle)) throw new StepError(`title "${title}" does not include "${step.expectTitle}"`);
    return;
  }
  if ('screenshot' in step) {
    await page.screenshot({ path: resolve(outDir, `${step.screenshot}.png`), fullPage: true });
    return;
  }
  await page.waitForTimeout(step.wait);
}

function locate(page: Page, target: Target): Locator {
  if ('role' in target) return page.getByRole(target.role as Parameters<Page['getByRole']>[0], { name: target.name });
  if ('label' in target) return page.getByLabel(target.label);
  if ('text' in target) return page.getByText(target.text);
  if ('testId' in target) return page.getByTestId(target.testId);
  return page.locator(target.selector);
}

function describe(step: Step): string {
  const [key] = Object.keys(step);
  const value = Object.values(step)[0];
  return `${key ?? 'step'} ${typeof value === 'string' || typeof value === 'number' ? String(value) : JSON.stringify(value)}`;
}

function unexpectedEntries(name: string, entries: readonly string[], allowed: readonly string[]): CheckResult {
  const unexpected = entries.filter((entry) => !allowed.some((pattern) => entry.includes(pattern)));
  return {
    name: `no ${name}`,
    passed: unexpected.length === 0,
    detail: unexpected.length === 0 ? '' : unexpected.map((entry) => truncate(entry, 120)).join(' | '),
  };
}

await main();
