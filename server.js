// server.js
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
app.use(cors());
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
    servers: [{ url: 'http://localhost:5000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'JWT token from /api/admin/login. Paste only the token (without "Bearer" prefix)'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'], // ناخد الـ docs من ملفات routes مباشرة
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
