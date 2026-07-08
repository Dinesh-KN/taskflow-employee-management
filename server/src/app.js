import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import apiRoutes from './routes/index.js';

import { globalErrorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/not-found.middleware.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', apiRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
