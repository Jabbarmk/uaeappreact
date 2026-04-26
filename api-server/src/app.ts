import express from 'express';
import session from 'express-session';
import cors from 'cors';
import compression from 'compression';
import path from 'path';

import homeRouter from './routes/home';
import categoriesRouter from './routes/categories';
import businessesRouter from './routes/businesses';
import classifiedsRouter from './routes/classifieds';
import jobsRouter from './routes/jobs';
import offersRouter from './routes/offers';
import profilesRouter from './routes/profiles';
import pagesRouter from './routes/pages';
import adminRouter from './routes/admin';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin: process.env.SITE_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(compression() as any);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
}));

// Serve uploaded files
const uploadsPath = path.resolve(process.env.UPLOAD_PATH || '../assets/uploads');
app.use('/assets/uploads', express.static(uploadsPath));
app.use('/assets/images', express.static(path.resolve('../assets/images')));

// API routes
app.use('/api/home', homeRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/businesses', businessesRouter);
app.use('/api/classifieds', classifiedsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/offers', offersRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/admin', adminRouter);

app.use(errorHandler);

export default app;
