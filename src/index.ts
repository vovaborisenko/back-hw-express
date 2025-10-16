import express from 'express';
import { setupApp } from './setup-app';

const app = express();
setupApp(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
