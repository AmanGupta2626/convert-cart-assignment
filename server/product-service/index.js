import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import { ingestWooProducts } from './utils/ingestWooProducts.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

const startServer = async () => {
    await connectDB();
    await ingestWooProducts();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
