import Product from '../models/productModel.js';

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // fetch all from MongoDB
    res.status(200).json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
