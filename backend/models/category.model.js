const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    deletedAt:{
        type:Date,
        default:null
    }
}, {
    timestamps: true
})


const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;