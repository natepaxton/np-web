#!/usr/bin/env node
/**
 * Pre-push check script that runs the same checks as CI.
 * Run this before creating PRs to catch issues early.
 *
 * Usage:
 *   node tools/scripts/pre-push-check.mjs
 *   npm run pre-push
 */

import { spawn } from 'node:child_process';

const steps = [
  { name: 'Format check', cmd: 'npx', args: ['nx', 'format:check'] },
  { name: 'Lint', cmd: 'npx', args: ['nx', 'run-many', '-t', 'lint'] },
  { name: 'Test', cmd: 'npx', args: ['nx', 'run-many', '-t', 'test'] },
  { name: 'Build', cmd: 'npx', args: ['nx', 'run-many', '-t', 'build'] },
];

async function runCommand(name, cmd, args) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`▶ ${name}`);
    console.log(`  Running: ${cmd} ${args.join(' ')}`);
    console.log('='.repeat(60));

    const proc = spawn(cmd, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ ${name} passed`);
        resolve();
      } else {
        reject(new Error(`${name} failed with exit code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`${name} failed to start: ${err.message}`));
    });
  });
}

async function main() {
  console.log('🔍 Running pre-push checks...\n');
  console.log('These are the same checks that run in CI.');
  console.log('Fix any issues before pushing.\n');

  const startTime = Date.now();

  for (const step of steps) {
    try {
      await runCommand(step.name, step.cmd, step.args);
    } catch (err) {
      console.error(`\n❌ ${err.message}`);
      console.error('\nPre-push checks failed. Please fix the issues above.');
      process.exit(1);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ All pre-push checks passed in ${elapsed}s`);
  console.log('='.repeat(60));
}

main();
