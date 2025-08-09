import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import connectDB from './config/database.js';
import segmentRoutes from './routes/segmentRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "ConvertCart Segment Service API"
}));

app.use('/api/segments', segmentRoutes);


const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Segment Service running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();