import React, { useState, useEffect } from 'react';
import { fetchProducts, evaluateSegment } from '../services/apiservice';
import ProductGrid from '../components/ProductGrid';
import SegmentEditor from '../components/SegmentEditor';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [segmentRules, setSegmentRules] = useState('');
  const [resultsVisible, setResultsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleEvaluate = async () => {
    if (!segmentRules.trim()) {
      setFilteredProducts(products);
      setResultsVisible(false);
      return;
    }

    try {
      setLoading(true);
      const result = await evaluateSegment(segmentRules);
      setFilteredProducts(result);
      setResultsVisible(true);
      setError(null);
    } catch (err) {
      setError('Failed to evaluate segment. Please check your rules and try again.');
      setResultsVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSegmentRules('');
    setFilteredProducts(products);
    setResultsVisible(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Product Segmentation</h1>
          <p className="mt-2 text-lg text-gray-600">
            Filter products using simple text-based rules
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1">
            <SegmentEditor
              segmentRules={segmentRules}
              setSegmentRules={setSegmentRules}
              onEvaluate={handleEvaluate}
              onReset={handleReset}
              loading={loading}
            />

         
            {resultsVisible && (
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Results</h2>

                {error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                    {error}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-80">
                    <pre className="text-sm text-gray-800">
                      {JSON.stringify(filteredProducts, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

       
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Products {resultsVisible && `(${filteredProducts.length} matches)`}
                </h2>
                <span className="text-sm text-gray-500">
                  {products.length} products total
                </span>
              </div>

              <ProductGrid
                products={products}
                filteredProducts={filteredProducts}
                loading={loading}
                error={error}
                resultsVisible={resultsVisible}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;