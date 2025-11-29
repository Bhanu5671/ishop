const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    area: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    landmark: {
        type: String,
        required: true,
        trim: true
    },
    isdefault: {
        type: Boolean,
        default: false
    },
    zipcode: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false })

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    address: [
        {
            type: addressSchema,
            required: true
        }
    ],
    loginAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);