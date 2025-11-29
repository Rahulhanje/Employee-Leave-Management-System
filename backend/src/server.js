import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
// Import models (will be used in routes)
import { User, LeaveRequest } from './models/index.js';
// Import routes
import authRoutes from './routes/auth.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 Server running on port ${PORT}               ║
║   📝 Environment: ${process.env.NODE_ENV || 'development'}              ║
║   🌐 API: http://localhost:${PORT}/api            ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
