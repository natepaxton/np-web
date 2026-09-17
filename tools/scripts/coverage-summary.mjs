// Prints a Markdown table of coverage totals for every project under coverage/:
// Jest (coverage-summary.json) and .NET via ReportGenerator (Summary.json).
// Used by CI to write the GitHub Actions job summary: node tools/scripts/coverage-summary.mjs >> "$GITHUB_STEP_SUMMARY"
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const root = 'coverage';

function findSummaries(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return findSummaries(path);
    return entry.name === 'coverage-summary.json' || entry.name === 'Summary.json' ? [path] : [];
  });
}

const pct = (value) => `${value ?? 100}%`;

function totals(file) {
  const json = JSON.parse(readFileSync(file, 'utf8'));
  if (json.total) {
    const { total } = json;
    return [total.lines.pct, total.statements.pct, total.functions.pct, total.branches.pct];
  }
  // ReportGenerator: no statement metric; methods stand in for functions.
  const { summary } = json;
  return [summary.linecoverage, null, summary.methodcoverage, summary.branchcoverage];
}

const rows = findSummaries(root)
  .sort()
  .map((file) => {
    const project = relative(root, dirname(file));
    const [lines, statements, functions, branches] = totals(file);
    const stmt = statements === null ? '—' : pct(statements);
    return `| \`${project}\` | ${pct(lines)} | ${stmt} | ${pct(functions)} | ${pct(branches)} |`;
  });

console.log('## Coverage\n');
if (rows.length === 0) {
  console.log('_No coverage reports found._');
} else {
  console.log('| Project | Lines | Statements | Functions / methods | Branches |');
  console.log('|---|---|---|---|---|');
  console.log(rows.join('\n'));
  console.log(
    '\nMinimums are enforced per project: `coverageThreshold` in each `jest.config.cts`, and `tools/scripts/dotnet-test-coverage.mjs` for .NET.',
  );
}
