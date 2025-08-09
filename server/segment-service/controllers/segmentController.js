import Product from '../models/productModel.js';
/**
 * @swagger
 * tags:
 *   name: Segments
 *   description: Product segment evaluation operations
 * 
 * @swagger
 * /api/segments/evaluate:
 *   post:
 *     summary: Find products matching multiple segment rules
 *     description: |
 *       Evaluates products against multiple rules (one per line).
 *       Supported operators: =, >, <, >=, <=
 *       Supported fields: price, stock_status, stock_quantity, on_sale, category, tags, title
 *     tags: [Segments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rules
 *             properties:
 *               rules:
 *                 type: string
 *                 description: |
 *                   Multi-line rules to evaluate (one rule per line).
 *                   Example: 
 *                   "price > 1000
 *                   stock_status = instock
 *                   category = Electronics"
 *                 example: |
 *                   price > 1000
 *                   stock_status = instock
 *                   on_sale = true
 *     responses:
 *       200:
 *         description: Array of matching products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid rule format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid rule format: 'price >> 100'. Expected format: field operator value"
 *       404:
 *         description: No products found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No products found matching the segment rules"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to evaluate segment"
 * 
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "5f8d0d55b54764421b7160f0"
 *         name:
 *           type: string
 *           example: "Premium Laptop"
 *         price:
 *           type: number
 *           example: 1499.99
 *         stock_status:
 *           type: string
 *           enum: [instock, outofstock, onbackorder]
 *           example: "instock"
 *         stock_quantity:
 *           type: integer
 *           example: 15
 *         on_sale:
 *           type: boolean
 *           example: false
 *         category:
 *           type: string
 *           example: "Electronics"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["laptop", "premium"]
 *         title:
 *           type: string
 *           example: "UltraBook Pro"
 */
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
