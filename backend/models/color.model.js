const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema(
    {
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
        deletedAt: {
            type: Date,
            default: null
        },
        hexacode: {
            type: String,
            required: true,
            unique: true
        }
    }, { timestamps: true }
)

const Color = mongoose.model("Color", ColorSchema);

module.exports = Color;