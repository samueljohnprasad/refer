import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import profileRoutes from './routes/profile.routes';
import referralRoutes from './routes/referral.routes';
import notificationRoutes from './routes/notification.routes';

// Import jobs
import { setupCloseExpiredJobsJob } from './jobs/closeExpiredJobs.job';

// Swagger imports
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger';

// Import middlewares
import { errorHandler } from './middlewares/error.middleware';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Swagger setup
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/hello', (req, res) => {
  res.send('Hello World!');
})
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/notifications', notificationRoutes);

// Start cron jobs
setupCloseExpiredJobsJob();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port,  () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

export default app;
