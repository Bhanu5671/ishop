const express = require("express");
const AdminLogsController = require("../controllers/adminLogs.controller");
const AdminLogsRouter = express.Router();

AdminLogsRouter.get("/get-data", AdminLogsController.getdata);

module.exports = AdminLogsRouter;