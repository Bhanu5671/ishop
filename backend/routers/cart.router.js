const express = require('express')
const CartController = require("../controllers/cart.controller")
const CartRouter = express.Router();

CartRouter.post("/add", CartController.addItemToCart);

CartRouter.post("/move-ls-to-cart", CartController.moveLsToCart);

CartRouter.get("/", CartController.getCartItems);

CartRouter.delete("/remove/:id", CartController.removeCartItems);

CartRouter.patch("/change-quantity", CartController.updateCartitem);


module.exports = CartRouter;