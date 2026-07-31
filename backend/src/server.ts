import 'dotenv/config';

import { createApp } from './app.js';
import { loadEnv } from './shared/config/env.js';
import { logger } from './shared/logging/logger.js';

const env = loadEnv();
const app = createApp({ env });

app.listen(env.PORT, () => {
  logger.info(
    {
      port: env.PORT,
      aiProvider: env.AI_PROVIDER,
      timeoutMs: env.AI_REQUEST_TIMEOUT_MS,
    },
    `[eduia-api] listening on http://localhost:${env.PORT}`,
  );
  logger.info(`[eduia-api] health: http://localhost:${env.PORT}/api/v1/health`);
  logger.info(
    `[eduia-api] tutor:  POST http://localhost:${env.PORT}/api/v1/tutor/messages`,
  );
});
