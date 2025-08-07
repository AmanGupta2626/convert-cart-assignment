import React, { useState, useEffect } from 'react';
import { fetchProducts, evaluateSegment } from '../services/apiservice';

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

  const renderProductCards = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
          No products match your segment rules.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h3>
                {product.on_sale && (
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Sale
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center">
                <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <span className={`ml-3 px-2 py-1 text-xs rounded-full ${product.stock_status === 'instock'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <p className="truncate">
                  <span className="font-medium">Category:</span> {product.category || 'Uncategorized'}
                </p>
                <p className="mt-1 truncate">
                  <span className="font-medium">Tags:</span> {product.tags.length > 0 ? product.tags.join(', ') : 'No tags'}
                </p>
                <p className="mt-1">
                  <span className="font-medium">Created:</span> {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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
          {/* Segment Editor Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Segment Editor</h2>

              <div className="mb-4">
                <label htmlFor="segment-rules" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter filter rules (one per line):
                </label>
                <textarea
                  id="segment-rules"
                  value={segmentRules}
                  onChange={(e) => setSegmentRules(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`price > 5000\ncategory = Smartphones\nstock_status = instock\nbrand != Samsung\nrating >= 4.0`}
                />
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">
                  Supported operators: <span className="font-mono">= != &gt; &lt; &gt;= &lt;=</span>
                </p>
                <p className="text-xs text-gray-500 italic">
                  Examples: price {">"} 5000, category = Smartphones, stock_status = instock
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleEvaluate}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                  {loading ? 'Processing...' : 'Evaluate Filter'}
                </button>

                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset
                </button>
              </div>
            </div>

          
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

              {renderProductCards()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;