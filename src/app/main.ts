import path from 'node:path';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { config } from '@/config';
import { errorMiddleware } from '@/middleware';
import { createRouter, log } from '@/utils';
import { router } from './router';

export const setup = async () => {
  const app = createRouter();

  app.onError(errorMiddleware);

  if (process.env.NODE_ENV === 'development') {
    const [{ openApiDocs }, { swaggerUI }] = await Promise.all([
      import('@/docs'),
      import('@hono/swagger-ui'),
    ]);

    app.get('/docs', (c) => c.json(openApiDocs));
    app.get('/swagger', swaggerUI({ url: '/docs' }));
  }

  app.use(cors());
  app.use(logger());

  app.get('/health', (c) => c.json('ok'));

  app.route('/api', router);

  const baseUrl = config.isDevelopment ? '/' : import.meta.dirname;
  const server = Bun.serve({
    port: config.server.port,
    tls: {
      key: Bun.file(path.resolve(baseUrl, './certs/key.pem')),
      cert: Bun.file(path.resolve(baseUrl, './certs/cert.pem')),
    },
    fetch: app.fetch,
    development: config.isDevelopment,
  });

  log.info(`Listening ${server.url}`);
};
