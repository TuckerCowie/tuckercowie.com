// Browser checks run against a built site served locally.
//   npm run build (or npm run preview) first, then npm run check:browser
import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.CHECK_PORT ?? 4319);
const dir = process.env.CHECK_DIR ?? 'dist';

export default defineConfig({
  testDir: './browser',
  outputDir: path.join(root, 'var/test-results'),
  fullyParallel: true,
  reporter: [['list']],
  timeout: 60_000,
  use: { baseURL: `http://127.0.0.1:${port}`, trace: 'off' },
  webServer: {
    command: `node src/build/serve.mjs ${dir} ${port}`,
    cwd: root,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: true,
  },
});
