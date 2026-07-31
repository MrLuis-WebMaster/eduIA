import 'dotenv/config';

import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3001);
const app = createApp();

app.listen(port, () => {
  console.log(`[eduia-api] listening on http://localhost:${port}`);
  console.log(`[eduia-api] health: http://localhost:${port}/api/v1/health`);
});
