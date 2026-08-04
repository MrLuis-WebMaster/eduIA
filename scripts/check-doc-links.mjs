import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const config = join(root, 'docs', '.markdown-link-check.json');

function collectMarkdown(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.vitepress' || entry === 'dist') {
      continue;
    }
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      collectMarkdown(full, out);
    } else if (entry.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

const files = [
  join(root, 'README.md'),
  join(root, 'AGENTS.md'),
  ...collectMarkdown(join(root, 'docs')),
  join(root, 'frontend', 'README.md'),
  join(root, 'backend', 'README.md'),
];

let failed = 0;

for (const file of files) {
  const rel = relative(root, file);
  const result = spawnSync(
    process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
    [
      'exec',
      'markdown-link-check',
      file,
      '-c',
      config,
      '-q',
    ],
    { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' },
  );

  if (result.status !== 0) {
    failed += 1;
    console.error(`\nLink check failed: ${rel}`);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  } else {
    console.log(`ok  ${rel}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} file(s) with broken links`);
  process.exit(1);
}

console.log(`\nChecked ${files.length} markdown files`);
