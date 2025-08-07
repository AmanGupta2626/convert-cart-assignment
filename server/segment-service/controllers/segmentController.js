import Product from '../models/productModel.js';

export const evaluateSegment = async (req, res) => {
  const { rules } = req.body;

  if (!rules || typeof rules !== 'string') {
    return res.status(400).json({ error: 'rules field must be a plain text string' });
  }

  try {
    const lines = rules.split('\n').map(line => line.trim()).filter(Boolean);
    const query = {};
    const validFields = {
      price: 'number',
      stock_status: ['instock', 'outofstock', 'onbackorder'],
      stock_quantity: 'number',
      on_sale: 'boolean',
      category: 'string',
      tags: 'string',
      title: 'string'
    };

    const validOperators = ['=', '>', '<', '>=', '<='];
    for (const line of lines) {
      const parts = line.split(/(=|>=|<=|>|<)/).map(s => s.trim());

      if (parts.length !== 3) {
        return res.status(400).json({
          error: `Invalid rule format: "${line}". Expected format: field operator value (e.g. price > 100)`
        });
      }

      const [field, operator, valueRaw] = parts;

      if (!validFields[field]) {
        return res.status(400).json({ error: `Unknown field "${field}" in rule: "${line}"` });
      }

      if (!validOperators.includes(operator)) {
        return res.status(400).json({
          error: `Invalid operator "${operator}" in rule: "${line}". Allowed: ${validOperators.join(', ')}`
        });
      }

      let value = valueRaw;
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(Number(value))) value = Number(value);

      const expectedType = validFields[field];
      if (Array.isArray(expectedType)) {
        if (!expectedType.includes(valueRaw)) {
          return res.status(400).json({
            error: `Invalid value "${valueRaw}" for field "${field}". Allowed: ${expectedType.join(', ')}`
          });
        }
      } else if (expectedType === 'number' && typeof value !== 'number') {
        return res.status(400).json({
          error: `Invalid value "${valueRaw}" for field "${field}". Expected a number`
        });
      } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
        return res.status(400).json({
          error: `Invalid value "${valueRaw}" for field "${field}". Expected true or false`
        });
      }

      switch (operator) {
        case '=':
          query[field] = value;
          break;
        case '>':
          query[field] = { $gt: value };
          break;
        case '<':
          query[field] = { $lt: value };
          break;
        case '>=':
          query[field] = { $gte: value };
          break;
        case '<=':
          query[field] = { $lte: value };
          break;
      }
    }

    const results = await Product.find(query);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No products found matching the segment rules' });
    }   
    res.status(200).json(results);
  } catch (err) {
    console.error('Segment evaluation failed:', err.message);
    res.status(500).json({ error: 'Failed to evaluate segment' });
  }
};
