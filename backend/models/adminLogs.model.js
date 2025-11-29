const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Login',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    operation: {
        type: String,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'READ'],
        required: true
    },
    // targetId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: false // Only required for actions on specific items
    // },
    // Category schema
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    // Product schema
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    // Color schema
    colorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color'
    },
    model: {
        type: String,
        enum: ["CATEGORY", "PRODUCT", "COLOR", "ACCESSORIES"],
        required: true
    },
    createdAt: {
        type: Date
    }
}, { timestamps: true });

const AdminLog = mongoose.model('AdminLog', adminLogSchema);

module.exports = AdminLog;