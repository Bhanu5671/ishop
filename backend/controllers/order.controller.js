const express = require("express")
const Order = require("../models/order.model")
const User = require("../models/user.model")
const Cart = require("../models/cart.model")
const Razorpay = require("razorpay")
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const razorpay_instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

const OrderController = {
    async createOrder(req, res) {
        try {
            const { user_id, order_total, shipping_address, payment_method } = req.body;
            const cart_data = await Cart.find({ user_id }).populate({ path: "product_id", select: "_id name final_price main_image" });
            const product_details = cart_data.map(
                (cd) => {
                    return {
                        product_id: cd.product_id._id,
                        name: cd.product_id.name,
                        qty: cd.qty,
                        price: cd.product_id.final_price,
                        total: Number(cd.qty) * Number(cd.product_id.final_price),
                        main_image: cd.product_id.main_image
                    }
                }
            )
            const order = new Order({
                user_id: user_id,
                product_details: product_details,
                shipping_address: shipping_address,
                order_total,
                payment_method,
                order_status: payment_method == 0 ? 1 : 0
            })
            console.log("Order", order)
            await order.save();
            console.log("Called")
            if (payment_method == 0) {
                // TODO:Email send karna hai

                await Cart.deleteMany({ user_id })
                res.send({ message: "Order Placed Successfully", flag: 1, order_id: order._id })
            } else {
                razorpay_instance.orders.create({
                    amount: order_total * 100,
                    currency: "INR",
                    receipt: order._id
                }, async function (err, razorpay_order) {
                    if (err) {
                        res.send({ message: "Unable to process payment", flag: 0 })
                    } else {
                        order.razorpay_order_id = razorpay_order.id;
                        await order.save();
                        res.send({ flag: 1, order_id: order._id, razorpay_order_id: razorpay_order.id })
                    }
                })
            }
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 });
        }
    },
    async paymentSuccess(req, res) {
        try {
            const { razorpay_response, user_id, order_id } = req.body;
            const order = await Order.findById(order_id);
            if (!order) {
                return res.send({ message: "Order Not Found", flag: 0 })
            }
            const user = await User.findById(user_id);
            if (!user) {
                return res.send({ message: "User Not Found", flag: 0 })
            }

            if (order.order_status == 1) {
                res.send({ message: "Order Already Paid", flag: 0 })
            }

            const generate_signature = crypto.createHmac("sha256", process.env.KEY_SECRET).update(razorpay_response.razorpay_order_id + "|" + razorpay_response.razorpay_payment_id).digest("hex");

            if (generate_signature !== razorpay_response.razorpay_signature) {
                return res.send({ message: "Payment verification failed", flag: 0 })
            }
            order.payment_status = 1;
            order.razorpay_payment_id = razorpay_response.razorpay_payment_id;
            order.order_status = 1;
            await order.save();
            await Cart.deleteMany({ user_id });
            res.send({ message: "Order Placed Successfully", flag: 1, order_id: order._id })
        } catch (error) {
            console.log("Error", error.message)
            res.send({ message: "Internal Server Error", flag: 0 })
        }

    },
    async getOrder(req, res) {
        try {
            const order_id = req.params.id;
            if (order_id) {
                const order_details = await Order.findById(order_id);
                res.send({ message: "Order Details fetch Successfully", flag: 1, order_details });

            }
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    async getBestSelling(req, res) {
        try {
            // Example using Mongoose
            const products = await Order.aggregate([
                { $unwind: "$product_details" },
                { $group: { _id: "$product_details.product_id", totalSold: { $sum: "$product_details.qty" } } },
                { $sort: { totalSold: -1 } },
                { $limit: 10 }, // Top 10 best sellers
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product_details"
                    }
                },
                { $unwind: "$product_details" }
            ]);
            console.log("Products", products);
            res.send({ message: "Fetch Successfully", flag: 1, products })
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },

    async getAllOrders(req, res) {
        try {
            const user_id = req.params.id;
            if (!user_id) {
                return res.send({ message: "User Id is required", flag: 0 })
            }
            const orders = await Order.find({ user_id }).sort({ createdAt: -1 });
            res.send({ message: "Orders fetch successfully", flag: 1, orders })
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },

    async getAllUsersOrders(req, res) {
        try {
            const allUserOrders = await Order.find().sort({ createdAt: -1 }).populate({ path: "user_id", select: "name email" });

            res.send({ message: "Orders fetch successfully", flag: 1, allUserOrders })
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },

    async getRecentOrder(req, res) {
        try {
            const recentOrders = await Order.find().sort({ createdAt: -1 }).populate({ path: "user_id", select: "name email" })
            res.send({ message: "Recent Order Fetch Successfully", flag: 1, recentOrders })
        } catch (error) {
            res.send({ message: "Unable to fetch Recent Order", flag: 0 })
        }
    }
}

module.exports = OrderController