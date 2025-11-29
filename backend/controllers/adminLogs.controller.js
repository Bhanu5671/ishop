const express = require("express");
const AdminLogs = require("../models/adminLogs.model");

const AdminLogsController = {
    async getdata(req, res) {
        try {
            const AdminLogsData = await AdminLogs.find({ createdAt: { $ne: null } }).sort({ createdAt: -1 }).populate(["categoryId", "adminId", "colorId", "productId"]);
            res.send({ message: "AdminLogs Fetch Successfully", flag: 1, AdminLogsData })
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0, error })
            console.log(error)
        }
    }
}

module.exports = AdminLogsController;