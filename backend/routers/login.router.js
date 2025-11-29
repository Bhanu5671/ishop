const express = require("express");
const LoginController = require("../controllers/login.controller");
const authorizationMiddleware = require('../middlewares/authorization');

const LoginRouter = express.Router();

LoginRouter.post("/createaccount", LoginController.create);

LoginRouter.post("/checklogin", LoginController.checklogin);

LoginRouter.post("/logout", LoginController.logout);

LoginRouter.get("/getalluser", LoginController.getalluser);

LoginRouter.patch("/toggleblock", authorizationMiddleware, LoginController.toggleBlock);

LoginRouter.delete("/deleteuser/:id", authorizationMiddleware, LoginController.deleteUser);


module.exports = LoginRouter;