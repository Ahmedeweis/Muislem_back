// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js'; // ما تمسحش
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// استيراد الـ routes الجديدة
import gamesRoutes from './routes/games.js';
import linksRoutes from './routes/links.js';
import imagesRoutes from './routes/images.js';
import sectionsRoutes from './routes/sections.js';
import genresRoutes from './routes/genres.js';
import platformsRoutes from './routes/platforms.js';
import searchRoutes from './routes/search.js';
import authRoutes from './routes/auth.js';
dotenv.config();
const app = express();
// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// Mount routes
app.use('/api/games', gamesRoutes);         // كل الـ routes اللي تخص الألعاب
app.use('/api/links', linksRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/platforms', platformsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', authRoutes); // دلوقتي POST /api/admin/login هيشتغل
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
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1); // هيقفل السيرفر لو فيه مشكلة
  }
};
startServer();
