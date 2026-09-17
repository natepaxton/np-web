// Where the API listens depends on how it is started: 5104 when it runs standalone, or a port
// Aspire or Docker assigns when it runs under the AppHost or Compose. Override the default with
// API_URL, e.g. `API_URL=http://localhost:61806 npx nx serve sandbox`.
//
// Playwright loads the workspace's .env.local before it starts the dev server, so putting API_URL
// there covers e2e runs as well.
export default {
  '/api': {
    target: process.env.API_URL ?? 'http://localhost:5104',
    changeOrigin: true,
  },
};
