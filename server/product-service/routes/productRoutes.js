import express from 'express';
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products from the database
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch products"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "Premium Headphones"
 *         price:
 *           type: number
 *           example: 299.99
 *         stock_status:
 *           type: string
 *           enum: [instock, outofstock, onbackorder]
 *           example: "instock"
 *         stock_quantity:
 *           type: integer
 *           example: 50
 *         on_sale:
 *           type: boolean
 *           example: false
 *         category:
 *           type: string
 *           example: "Audio"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["wireless", "noise-cancelling"]
 *         description:
 *           type: string
 *           example: "High-quality wireless headphones with noise cancellation"
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               src:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               alt:
 *                 type: string
 *                 example: "Headphones product image"
 */
import { getAllProducts } from '../controllers/productController.js';
const router = express.Router();

router.get('/', getAllProducts);

export default router;
