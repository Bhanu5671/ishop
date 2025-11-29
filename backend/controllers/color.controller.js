const express = require("express");
const Color = require("../models/color.model");
const { moveToTrash, getTrashed } = require("./category.controller");
const AdminLog = require("../models/adminLogs.model");


const ColorController = {
    async create(req, res) {
        try {
            const data = req.body;

            const ColorExist = await Color.findOne({ name: data.name }).countDocuments();
            if (ColorExist == 1) {
                return res.send(
                    {
                        message: "Color Already Added",
                        flag: 0
                    }
                )
            }

            const color = new Color({ name: data.name, slug: data.slug, hexacode: data.hexacode });
            color.save().then(() => {
                const adminLog = new AdminLog({
                    adminId: req.user._id,
                    action: "Save the new Color",
                    operation: "CREATE",
                    model: "COLOR",
                    colorId: color._id
                });
                adminLog.save().catch((error) => {
                    console.error("Failed to save admin log", error)
                })
                res.send({
                    message: "Color data added successfully",
                    flag: 1,
                });
            }).catch((error) => {
                res.send({
                    error: error,
                    message: "Unable to add Color data",
                    flag: 0,
                });
            });
        } catch (error) {
            res.send({ message: "Internal Server Issue", flag: 0 })
        }
    },
    async read(req, res) {
        try {
            let colors;
            const id = req.params.id;
            if (id) {
                colors = await Color.findById(id);
                res.send(
                    {
                        colors,
                        flag: 1,
                    }
                )
            } else {
                const filterQuery = {
                    deletedAt: null,
                };
                if (req.query.status) filterQuery.status = req.query.status;
                colors = await Color.find(filterQuery).sort({ createdAt: -1 });
                res.send(
                    {
                        colors,
                        flag: 1,
                        total: colors.length
                    }
                )
            }

        } catch (error) {
            res.send({
                message: "Internal server error",
                flag: 0
            });
        }
    },
    async status(req, res) {
        try {
            const id = req.body.id;
            const new_status = req.body.new_status;
            Color.findByIdAndUpdate(id, { status: new_status }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: `Change status from ${!new_status} to ${new_status}`,
                        operation: "UPDATE",
                        model: "COLOR",
                        colorId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Color Status Changed", flag: 1 })
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to Change Color the Status", flag: 0 })
                }
            )
        } catch (error) {
            res.send({ message: "Internal Server issue", flag: 0 })
        }

    },
    moveToTrash(req, res) {
        try {
            const id = req.params.id;
            Color.findByIdAndUpdate(id, { deletedAt: new Date }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Moved the Color to trash",
                        operation: "UPDATE",
                        model: "COLOR",
                        colorId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Move to trash", flag: 1 })
                }
            ).catch(
                (error) => {
                    res.send({ message: "Unable to move trash", flag: 0 })
                }
            )
        } catch (error) {
            res.send({ message: "Internal Server Issue", flag: 0 })
        }
    },
    async getTrashed(req, res) {
        try {
            const trashColors = await Color.find({ deletedAt: { $ne: null } }).sort({ createdAt: -1 });
            res.send({
                trashColors,
                total: trashColors.length,
                flag: 1
            }
            )
        } catch (error) {
            res.send({ message: "Internal Server Issue", flag: 0 });
        }
    },
    undo(req, res) {
        try {
            const id = req.params.id;
            Color.findByIdAndUpdate(id, { deletedAt: null }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Undo the Color",
                        operation: "UPDATE",
                        model: "COLOR",
                        colorId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Category Undo from Trash", flag: 1 })
                }
            ).catch(
                (error) => {
                    res.send({ message: "Unable to Undo Category", flag: 1 })
                }
            )
        } catch (error) {
            res.send({
                message: "Internal server error",
                flag: 0
            });
        }
    },
    delete(req, res) {
        try {
            const id = req.params.id;
            Color.findByIdAndDelete(id).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Delete the Color",
                        operation: "DELETE",
                        model: "COLOR",
                        colorId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Color Deleted", flag: 1 })
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to delete color", flag: 0 })
                }
            )
        } catch (err) {
            res.send({ message: "Internal server issue", flag: 0 })
        }
    },
    update(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            Color.findByIdAndUpdate(id, { name: data.name, slug: data.slug }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Update the Color",
                        operation: "UPDATE",
                        model: "COLOR",
                        colorId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Color Updated", flag: 1 })
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to Update Color", flag: 0 })
                }
            )
        } catch (error) {
            res.send({ message: "Internal server issue", flag: 0 });
        }
    }
}

module.exports = ColorController;