import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    wooId: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: false,
    },
    stock_status: {
        type: String,
        enum: ['instock', 'outofstock', 'onbackorder'],
        required: false,
    },
    stock_quantity: {
        type: Number,
        required: false,
        default: 0,
    },
    category: {
        type: String,
        required: false,
    },
    tags: {
        type: [String],
        required: false,
    },
    on_sale: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        required: false,
    },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
