import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import segmentRoutes from './routes/segmentRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/segments', segmentRoutes);

app.listen(PORT, () => {
  console.log(`segment-service running on port ${PORT}`);
});
