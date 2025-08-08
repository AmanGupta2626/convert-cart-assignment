import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
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
          <span className="text-xl font-bold text-gray-900">{product.price}</span>
          <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
            product.stock_status === 'instock'
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
  );
};

export default ProductCard; 