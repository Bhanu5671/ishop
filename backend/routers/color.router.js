const express = require("express");
const ColorController = require("../controllers/color.controller");
const authorizationMiddleware = require("../middlewares/authorization")

const ColorRouter = express.Router();

ColorRouter.post("/create", authorizationMiddleware, ColorController.create);

ColorRouter.get("/get-data", ColorController.read);

ColorRouter.get("/get-data/:id", ColorController.read);

ColorRouter.patch("/change_status", authorizationMiddleware, ColorController.status);

ColorRouter.patch("/move-to-trash/:id", authorizationMiddleware, ColorController.moveToTrash);

ColorRouter.get("/get-trashed", ColorController.getTrashed);

ColorRouter.patch("/undo/:id", authorizationMiddleware, ColorController.undo);

ColorRouter.delete("/delete/:id", authorizationMiddleware, ColorController.delete);

ColorRouter.put("/update/:id", authorizationMiddleware, ColorController.update);


module.exports = ColorRouter;
