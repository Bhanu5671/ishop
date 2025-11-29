const express = require("express");
const Category = require("../models/category.model");
const AdminLog = require("../models/adminLogs.model");
const Product = require("../models/product.model");
const CategoryController = {

    undo(req, res) {
        try {
            const id = req.params.id;
            Category.findByIdAndUpdate(id, { deletedAt: null }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Undo the Category",
                        operation: "UPDATE",
                        model: "CATEGORY",
                        categoryId: id
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
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    async getTrashed(req, res) {
        try {
            const trashData = await Category.find({ deletedAt: { $ne: null } }).sort({ createdAt: -1 });
            res.send({
                trashData,
                total: trashData.length,
                flag: 1
            }
            )

        } catch (error) {
            res.send({
                message: "Internal Server Error",
                flag: 0
            }
            )
        }
    },
    async status(req, res) {
        try {
            const id = req.body.id;
            const new_status = req.body.new_status;
            Category.findByIdAndUpdate(id, { status: new_status }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: `Change status from ${!new_status} to ${new_status}`,
                        operation: "UPDATE",
                        model: "CATEGORY",
                        categoryId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Status Changed Successfully", flag: 1 })
                }
            ).catch(
                (error) => {
                    res.send({ message: "Unable to Change Status", flag: 0 })
                }
            )
        } catch (error) {
            console.error("Internal Server Error:", error);
            res.send({ message: "Internal Server Issue", flag: 0 })
        }
    },
    async create(req, res) {
        try {
            const data = req.body;

            const CategoryExists = await Category.findOne({ name: data.name }).countDocuments();
            if (CategoryExists == 1) {
                return res.send({
                    message: "Category already exists",
                    flag: 0
                })
            }

            const category = new Category({ name: data.name, slug: data.slug });
            category.save().then(() => {
                const adminLog = new AdminLog({
                    adminId: req.user._id,
                    action: "Create new Category",
                    operation: "CREATE",
                    model: "CATEGORY",
                    categoryId: category._id
                });
                adminLog.save().catch((error) => {
                    console.error("Failed to save admin log", error)
                })
                res.send({
                    message: "Category created successfully",
                    flag: 1,
                });
            }).catch(() => {
                res.send({
                    message: "Unable to create Category",
                    flag: 0,
                });
            });
        } catch (error) {
            res.send({
                message: "Internal server error",
                flag: 0,
            })
        }
    },
    async read(req, res) {
        try {
            let categories;
            if (req.params.id) {
                categories = await Category.findById(req.params.id);
                res.send({
                    categories,
                    flag: 1
                });
            } else {
                const filterQuery = {
                    deletedAt: null,
                };
                if (req.query.status) {
                    filterQuery.status = req.query.status;
                }

                console.log("filterQuery:", filterQuery);

                const sortObj = {};
                if (req.query.sortByName) {
                    sortObj.name = Number(req.query.sortByName);
                } else {
                    sortObj.createdAt = -1;
                }

                console.log("sortObj:", sortObj);
                categories = await Category.find(filterQuery).sort(sortObj);

                const data = [];
                await Promise.all(categories.map(async (category) => {
                    const ProductCount = await Product.find({ category_id: category._id }).countDocuments();
                    data.push({
                        ...category.toObject(),
                        ProductCount
                    });
                }));
                categories = [...data];
                res.send({
                    categories,
                    total: categories.length,
                    flag: 1
                });
            }
            // const categories = await Category.find({ deletedAt: null }).sort({ createdAt: -1 });
            // res.send({
            //     categories,
            //     total: categories.length,
            //     flag: 1
            // });
        } catch (error) {
            res.send({
                message: "Internal server error",
                flag: 0
            });
        }
    },
    async update(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            console.log(id)
            Category.findByIdAndUpdate(id, { name: data.name, slug: data.slug }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Update in the Category",
                        operation: "UPDATE",
                        model: "CATEGORY",
                        categoryId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Category Updated", flag: 1 })
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to Update Category", flag: 0 })
                }
            )
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    delete(req, res) {
        try {
            const id = req.params.id;
            Category.findByIdAndDelete(id).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Delete the Category",
                        operation: "DELETE",
                        model: "CATEGORY",
                        categoryId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Category Deleted", flag: 1 })
                }
            ).catch(
                () => {
                    console.error("READ ERROR:", error); // <- log this
                    res.send({ message: "Unable to delete category", flag: 0 })
                }
            )
        } catch (err) {
            console.error("READ ERROR:", error); // <- log this
            res.send({ message: "Internal server issue", flag: 0 })
        }
    },
    async moveToTrash(req, res) {
        const id = req.params.id;
        try {
            Category.findByIdAndUpdate(id, { deletedAt: new Date() }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Moved the Category to trash",
                        operation: "UPDATE",
                        model: "CATEGORY",
                        categoryId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Move to trash", flag: 1 })
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to move trash", flag: 0 })

                }
            )
        } catch (err) {
            console.log(err)
            res.send({ message: "Internal Server Issue", flag: 0 })
        }
    }
}

module.exports = CategoryController;