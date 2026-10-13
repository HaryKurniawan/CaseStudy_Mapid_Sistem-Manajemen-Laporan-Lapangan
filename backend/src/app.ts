import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import reportRoutes from './routes/report.routes.js';
import { swaggerDocument } from './swagger/swaggerDoc.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

export const createApp = (): Application => {
  const app = express();

  // Middleware Global
  app.use(
    cors({
      origin: '*', // Di production dapat disesuaikan dengan process.env.FRONTEND_URL
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  // Disable caching for dynamic API responses
  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'Field Reports Management API',
    });
  });

  // Swagger Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Rute API Autentikasi, Pengguna, dan Laporan
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/reports', reportRoutes);

  // 404 Handler & Error Handler
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
