import dotenv from 'dotenv';
dotenv.config();

import { createApp } from '../src/app.js';

const app = createApp();

export default app;

// Kompatibilitas Vercel Serverless Function runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
  (module.exports as any).default = app;
}
