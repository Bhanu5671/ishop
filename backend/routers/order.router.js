const express = require("express")
const OrderController = require("../controllers/order.controller");
const authorizationMiddleware = require("../middlewares/authorization");
const OrderRouter = express.Router();

OrderRouter.post("/create", authorizationMiddleware, OrderController.createOrder);

OrderRouter.get("/get-order/:id", OrderController.getOrder);

OrderRouter.get("/best-selling", OrderController.getBestSelling);

OrderRouter.post("/success", OrderController.paymentSuccess);

OrderRouter.get("/get-all-orders/:id", authorizationMiddleware, OrderController.getAllOrders);

OrderRouter.get("/getallorders", authorizationMiddleware, OrderController.getAllUsersOrders);

OrderRouter.get("/recent-order", authorizationMiddleware, OrderController.getRecentOrder);



module.exports = OrderRouter;