const express = require('express');
const CategoryController = require('../controllers/category.controller');
const authorizationMiddleware = require("../middlewares/authorization");

const CategoryRouter = express.Router();

CategoryRouter.post("/create", authorizationMiddleware, CategoryController.create);

CategoryRouter.get("/get-data", CategoryController.read);

CategoryRouter.get("/get-data/:id", CategoryController.read);

CategoryRouter.put("/update/:id", authorizationMiddleware, CategoryController.update);

CategoryRouter.delete("/delete/:id", authorizationMiddleware, CategoryController.delete);

CategoryRouter.patch("/change_status", authorizationMiddleware, CategoryController.status);

CategoryRouter.patch("/move-to-trash/:id", authorizationMiddleware, CategoryController.moveToTrash);

CategoryRouter.get("/get-trashed", CategoryController.getTrashed);

CategoryRouter.patch("/undo/:id", authorizationMiddleware, CategoryController.undo);

module.exports = CategoryRouter;