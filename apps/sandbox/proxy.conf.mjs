import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Where the API listens depends on how it is started: 5104 when it runs standalone, or a port
// Aspire or Docker assigns when it runs under the AppHost or Compose. Point the proxy at it with
// API_URL, either in the workspace's gitignored .env.local or inline:
//   API_URL=http://localhost:61806 npx nx serve sandbox
// An inline value wins over .env.local, which is how Node's env-file loading works.
const envFile = join(import.meta.dirname, '..', '..', '.env.local');
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

export default {
  '/api': {
    target: process.env.API_URL ?? 'http://localhost:5104',
    changeOrigin: true,
  },
};
