const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    recommend: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false })

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    original_price: {
        type: Number,
        required: true
    },
    discount_percentage: {
        type: Number,
        required: true
    },
    final_price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    main_image: {
        type: String,
        required: true
    },
    other_images: {
        type: [String],
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    colors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Color',
            required: true
        }
    ],
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date,
        default: null
    },
    review: [{
        type: reviewSchema,
        default: null
    }]
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

module.exports = Product;