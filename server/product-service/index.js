import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import connectDB from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import { ingestWooProducts } from "./utils/ingestWooProducts.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

cron.schedule("0 * * * *", async () => {
	console.log("Running scheduled WooCommerce product ingestion...");
	await ingestWooProducts();
});

const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

startServer();
