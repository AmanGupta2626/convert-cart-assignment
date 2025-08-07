import Product from '../models/productModel.js';

export const evaluateSegment = async (req, res) => {
    const { rules } = req.body;

    if (!rules || typeof rules !== 'string') {
        return res.status(400).json({ error: 'Rules must be a plain text string' });
    }

    try {
        const lines = rules.split('\n').map(line => line.trim()).filter(Boolean);

        const query = {};

        for (const line of lines) {
            const [field, operator, valueRaw] = line.split(/(=|>=|<=|>|<)/).map(s => s.trim());

            let value = valueRaw;
            if (value === 'true') value = true;
            else if (value === 'false') value = false;
            else if (!isNaN(Number(value))) value = Number(value);

            // Build query based on operator
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
                default:
                    return res.status(400).json({ error: `Unsupported operator: ${operator}` });
            }
        }

        const results = await Product.find(query);
        res.status(200).json(results);
    } catch (err) {
        console.error('❌ Evaluation error:', err.message);
        res.status(500).json({ error: 'Failed to evaluate segment' });
    }
};
