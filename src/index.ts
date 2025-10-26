import express from 'express';
import { setupApp } from './setup-app';
import { runDB } from './db/mongo.db';
import { SETTINGS } from './core/settings/settings';

async function bootstrap() {
  const app = express();
  setupApp(app);
  const PORT = SETTINGS.PORT;

  await runDB(SETTINGS.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });

  return app;
}

bootstrap();
