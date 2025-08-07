const productServiceUrl = import.meta.env.VITE_PRODUCT_SERVICE_URL;
const segmentServiceUrl = import.meta.env.VITE_SEGMENT_SERVICE_URL;

const endpoints = {
    getProducts: `${productServiceUrl}/api/products`,
    evaluateProduct: `${segmentServiceUrl}/api/segments/evaluate`,
}
export const fetchProducts = async () => {
  try {
    const res = await fetch(endpoints.getProducts);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('fetchProducts error:', err.message);
    throw err;
  }
};

export const evaluateSegment = async (rulesText) => {
  try {
    const res = await fetch(endpoints.evaluateProduct, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rules: rulesText })
    });

    if (!res.ok) {
      const errRes = await res.json();
      throw new Error(errRes.error || 'Evaluation failed');
    }

    return await res.json();
  } catch (err) {
    console.error('evaluateSegment error:', err.message);
    throw err;
  }
};