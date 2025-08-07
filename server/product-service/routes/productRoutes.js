import express from 'express';
import { getAllProducts } from '../controllers/productController.js';
const router = express.Router();

router.get('/', getAllProducts);

// (Optional) Ingest WooCommerce products manually
// router.post('/ingest', ingestWooProducts);

export default router;
