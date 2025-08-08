import React from 'react';

const SegmentEditor = ({ 
  segmentRules, 
  setSegmentRules, 
  onEvaluate, 
  onReset, 
  loading 
}) => {
  return (
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
          onClick={onEvaluate}
          disabled={loading}
          className={`flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {loading ? 'Processing...' : 'Evaluate Filter'}
        </button>

        <button
          onClick={onReset}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SegmentEditor; 