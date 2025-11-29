const express = require("express");
const WishListController = require("../controllers/wishlist.controller");

const WishListRouter = express.Router();

WishListRouter.post("/add-product", WishListController.addProductToWishlist);

WishListRouter.get("/get-wishlist/:id", WishListController.getWishlistByUserId);

WishListRouter.delete("/remove-product", WishListController.removeProductFromWishlist);

module.exports = WishListRouter;