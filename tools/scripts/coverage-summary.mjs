// Prints a Markdown table of Jest coverage totals for every project under coverage/.
// Used by CI to write the GitHub Actions job summary: node tools/scripts/coverage-summary.mjs >> "$GITHUB_STEP_SUMMARY"
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const root = 'coverage';

function findSummaries(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return findSummaries(path);
    return entry.name === 'coverage-summary.json' ? [path] : [];
  });
}

const pct = (metric) => `${metric.pct}%`;
const rows = findSummaries(root)
  .sort()
  .map((file) => {
    const { total } = JSON.parse(readFileSync(file, 'utf8'));
    const project = relative(root, dirname(file));
    return `| \`${project}\` | ${pct(total.lines)} | ${pct(total.statements)} | ${pct(total.functions)} | ${pct(total.branches)} |`;
  });

console.log('## Coverage\n');
if (rows.length === 0) {
  console.log('_No coverage reports found._');
} else {
  console.log('| Project | Lines | Statements | Functions | Branches |');
  console.log('|---|---|---|---|---|');
  console.log(rows.join('\n'));
  console.log('\nMinimums are enforced per project by `coverageThreshold` in each `jest.config.cts`.');
}
