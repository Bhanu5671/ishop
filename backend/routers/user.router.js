const express = require("express");
const UserController = require("../controllers/user.controller");
const UserRouter = express.Router();

UserRouter.post("/register", UserController.register);

UserRouter.post("/login", UserController.login);

UserRouter.post("/update-profile", UserController.updateProfile);

UserRouter.post("/change-password", UserController.changePassword);

UserRouter.delete("/delete-address/:id", UserController.deleteAddress);

UserRouter.post("/save-address", UserController.saveAddress);

UserRouter.patch("/setdefault-address", UserController.setDefaultAddress);

UserRouter.put("/edit-address", UserController.editAddress);

UserRouter.get("/getallusers", UserController.getAllUsers);
module.exports = UserRouter;