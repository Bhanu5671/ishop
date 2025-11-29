/*
    user_id,
    shipping_address,
    product_details [{product_id, name, price, qty}]
    order_total
    payment_method (0:Pay On Delivery, 1:Razorpay)
    payment_status (0:Pending 1:Success 2:Failes 3:Refunded)
    razorpay_order_id (default: null)
    order_status (0:Pending 1:Placed 2:Packed 3:Shipped 4:Out for delivery 5:Delivered 6:Returned Request 7:Returned)
    timestamp
*/

const mongoose = require("mongoose")


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
    zipcode: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false })


const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        shipping_address: {
            type: addressSchema,
            required: true
        },
        product_details: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: String,
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                },
                total: {
                    type: Number,
                    required: true
                },
                main_image: {
                    type: String,
                    required: true
                }
            }
        ],
        order_total: {
            type: Number,
            required: true
        },
        payment_method: {
            type: Number,
            enum: [0, 1],
            required: true
        },
        payment_status: {
            type: Number,
            enum: [0, 1, 2, 3],
            default: 0
        },
        razorpay_order_id: {
            type: String,
            default: null
        },
        razorpay_payment_id: {
            type: String,
            default: null
        },
        order_status: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5, 6],
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;