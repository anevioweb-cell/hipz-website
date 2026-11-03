// `npm run check`: lint + format check + build + tests. Never hangs (per-step timeout),
// stops at the first failing step with a clear message.
import { spawnSync } from 'node:child_process';

const steps = [
  ['Lint (0 warnings allowed)', 'npm', ['run', '--silent', 'lint']],
  ['Prettier format check', 'npm', ['run', '--silent', 'format:check']],
  ['Production build', 'npm', ['run', '--silent', 'build']],
  ['Unit tests', 'npm', ['run', '--silent', 'test']],
];
const TIMEOUT_MS = 180_000;

for (const [label, cmd, args] of steps) {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(cmd, args, {
    stdio: 'inherit',
    timeout: TIMEOUT_MS,
    env: { ...process.env, CI: '1' },
  });
  if (r.error?.code === 'ETIMEDOUT') {
    console.error(`\n✖ CHECK FAILED: "${label}" timed out after ${TIMEOUT_MS / 1000}s.`);
    process.exit(1);
  }
  if (r.status !== 0) {
    console.error(`\n✖ CHECK FAILED at step: ${label} (exit code ${r.status}).`);
    process.exit(r.status ?? 1);
  }
}
console.log('\n✔ CHECK PASSED: lint, format, build and tests all clean.');
