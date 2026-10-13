import app from '../src/index.js';

export default app;

// Kompatibilitas Vercel Serverless Function runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
  (module.exports as any).default = app;
}
