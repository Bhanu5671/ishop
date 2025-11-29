const express = require("express");
const Wishlist = require("../models/wishlist.model");
const { get } = require("mongoose");

const WishListController = {
    async addProductToWishlist(req, res) {
        try {
            const { user_id, product_id } = req.body;
            const existsWishList = await Wishlist.find({ user: user_id, product: product_id });
            if (existsWishList.length > 0) {
                return res.send({ message: "Product already in wishlist", flag: 0 })
            }
            const wishlist = new Wishlist({
                user: user_id,
                product: product_id
            })
            wishlist.save().then(() => {
                res.send({ message: "Product added to wishlist", wishlist, flag: 1 })
            }).catch((error) => {
                console.log(error)
                res.send({ message: "Unable to add to wishlist", flag: 0 })
            })
        } catch (error) {
            console.log("Error in Wishlist", error.message)
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    async getWishlistByUserId(req, res) {
        try {
            const user_id = req.params.id;
            const wishListProduct = await Wishlist.find({ user: user_id }).populate("product");
            res.send({ wishListProduct, flag: 1 })
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    removeProductFromWishlist(req, res) {
        try {
            const { user_id, product_id } = req.body;
            const wishlist = Wishlist.findOneAndDelete({ user: user_id, product: product_id }).then(() => {
                res.send({ message: "Product removed from wishlist", wishlist, flag: 1 })
            }).catch((error) => {
                console.log(error)
                res.send({ message: "Unable to remove from wishlist", flag: 0 })
            })
        } catch (error) {
            console.log("Error in Wishlist", error.message)
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    }
}

module.exports = WishListController;