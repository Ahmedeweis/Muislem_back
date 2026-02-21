// server.js
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// استيراد الـ routes الجديدة
// import authRoutes from './routes/auth.js'; // Removed
import groupRoutes from './routes/groups.js';
import habitRoutes from './routes/habits.js';

dotenv.config();
const app = express();

// Middlewares
const allowedOrigins = [
  'https://muislem-front.onrender.com',
  'http://localhost:5173',
  'http://localhost:4173',
];
app.use(cors({
  origin: (origin, callback) => {
    // السماح للطلبات اللي معهاش origin (زي Postman) أو من الـ allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Mount routes
// app.use('/api/admin', authRoutes); // Removed
app.use('/api/groups', groupRoutes);
app.use('/api/habits', habitRoutes);
// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Games API',
      version: '1.0.0',
      description: 'API documentation for the Games Management System',
    },
    servers: [
      { url: 'https://muislem-back.onrender.com', description: 'Production Server' },
      { url: 'http://localhost:5000', description: 'Local Development' },
    ],
  },
  apis: [join(dirname(fileURLToPath(import.meta.url)), 'routes', '*.js')], // مسار مطلق يشتغل على Render
};
const startServer = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB connected:', res.rows[0]);
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1); // هيقفل السيرفر لو فيه مشكلة
  }
};
startServer();
