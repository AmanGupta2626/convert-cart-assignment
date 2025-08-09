import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
// import cron from "node-cron";
import connectDB from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import { ingestWooProducts } from "./utils/ingestWooProducts.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "ConvertCart Product Service API"
}));


app.use("/api/products", productRoutes);

// cron.schedule("0 * * * *", async () => {
// 	console.log("Running scheduled WooCommerce product ingestion...");
// 	await ingestWooProducts();
// });

const startServer = async () => {
  try {
    await connectDB();
    await ingestWooProducts();
    
    app.listen(PORT, () => {
      console.log(`Product Service running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();