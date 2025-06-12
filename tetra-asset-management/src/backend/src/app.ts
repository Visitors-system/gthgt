import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes'; // UNCOMMENTED
// import { errorHandler } from './middleware/errorHandler'; // Will be created later
// import { logger } from './utils/logger'; // Will be created later

dotenv.config({ path: '../../.env.local' });

const app: Express = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('TETRA Asset Management Backend is running!');
});

app.use('/api/v1', apiRoutes); // UNCOMMENTED AND USED

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// app.use(errorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
