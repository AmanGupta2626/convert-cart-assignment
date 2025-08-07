import axios from 'axios';
import Product from '../models/productModel.js';

export const ingestWooProducts = async () => {
  try {
    const response = await axios.get(`${process.env.WC_BASE_URL}/products`, {
      auth: {
        username: process.env.WC_CONSUMER_KEY,
        password: process.env.WC_CONSUMER_SECRET
      },
      params: {
        per_page: 100
      }
    });
    console.log('Fetched products from WooCommerce', response);

    const rawProducts = response.data;

    const formattedProducts = rawProducts.map(item => ({
      wooId: item.id,
      title: item.name,
      price: item.price && !isNaN(parseFloat(item.price)) ? parseFloat(item.price) : 0,
      stock_status: item.stock_status,
      stock_quantity: item.stock_quantity ?? 0,
      category: item.categories?.[0]?.name || '',
      tags: item.tags?.map(tag => tag.name) || [],
      on_sale: item.on_sale,
      created_at: item.date_created
    }));

    await Product.deleteMany(); // optional: wipe existing
    await Product.insertMany(formattedProducts);

    console.log(`Ingested ${formattedProducts.length} products`);
  } catch (err) {
    console.error('WooCommerce ingestion failed:', err.message);
  }
};
