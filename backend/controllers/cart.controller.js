const express = require("express");

const Cart = require("../models/cart.model");

const CartController = {
    async moveLsToCart(req, res) {
        try {
            const { user_id, cart_items } = req.body;
            const allPromises = cart_items.map(
                async (item) => {
                    const cartExist = await Cart.findOne({ user_id, product_id: item.productId });
                    if (cartExist) {
                        const newQty = cartExist.qty + Number(item.quantity);
                        cartExist.qty = newQty;
                        await cartExist.save();
                    } else {
                        const cart = new Cart({ user_id, product_id: item.productId, qty: item.quantity });
                        await cart.save();
                    }
                }
            )
            await Promise.all(allPromises);
            const final_user_cart = await Cart.find({ user_id }).populate({ path: "product_id", select: "original_price final_price _id" })
            res.send({ final_user_cart, flag: 1 })
        } catch (error) {
            console.log("moveLsToCart error:", error)
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    getCartItems() {

    },
    addItemToCart() {

    },
    async removeCartItems(req, res) {
        try {
            const id = req.params.id;
            const { userId } = req.body;
            await Cart.findOneAndDelete({ user_id: userId, product_id: id }).then(
                () => {
                    res.send({ message: "Item Remove Successfully", flag: 1 })
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to remove item", flag: 0 })
                }
            )
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    async updateCartitem(req, res) {
        try {
            const { userId, productId, new_qty } = req.body;
            if (new_qty == 0) return
            await Cart.findOneAndUpdate(
                { user_id: userId, product_id: productId },
                { qty: Number(new_qty) }
            ).then(
                () => {
                    res.send({ message: "Quantity Updated", flag: 1 })
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to update quantity", flag: 0 })
                }
            )
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    }
}

module.exports = CartController