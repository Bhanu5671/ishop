const express = require('express');
const Product = require('../models/product.model');
const { generateFileName } = require('../helper');
const fs = require('fs');
const AdminLog = require('../models/adminLogs.model');
const Category = require('../models/category.model');
const Color = require('../models/color.model');

const ProductController = {

    async deleteOtherImage(req, res) {
        try {
            const { pId, image_index } = req.params;
            const product = await Product.findById(pId);
            if (product) {
                const otherImages = product.other_images;
                fs.unlinkSync("./public/images/products/other-images/" + otherImages[image_index]);
                otherImages.splice(image_index, 1);
                product.other_images = otherImages;
                await product.save();
                res.send({ message: "Image Deleted", flag: 1, otherImages })
            } else {
                res.send({ message: "Unable to delete Image" });
            }
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    async uploadOtherImages(req, res) {
        try {
            const { pId } = req.params;
            const product = await Product.findById(pId);
            if (product) {
                const otherImages = product.other_images;
                const images = req.files.images;
                for (img of images) {
                    const name = generateFileName(img.name);
                    const destination = "./public/images/products/other-images";
                    await img.mv(destination + "/" + name);
                    otherImages.push(name);
                }
                product.other_images = otherImages;
                await product.save();
                res.send({ message: "Images Added", flag: 1, otherImages })
            } else {
                res.send({ message: "Product not found" });
            }

        } catch (error) {
            console.log(error)
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    createProduct: async (req, res) => {
        try {
            const image = req.files.image;
            const { name, slug, original_price, discount_percentage, final_price, description, category, colors } = req.body;
            const destination = "./public/images/products/";
            console.log("Orginal", image.name);
            console.log("Orginal", colors);
            const imageNames = generateFileName(image.name);
            console.log(imageNames);
            image.mv(
                destination + imageNames,
                (err) => {
                    if (err) {
                        return res.send({ message: "Unable to upload Image", flag: 0 });
                    } else {
                        const product = new Product({
                            name: name,
                            slug: slug,
                            original_price: original_price,
                            discount_percentage: discount_percentage,
                            final_price: final_price,
                            description: description,
                            main_image: imageNames,
                            category_id: category,
                            colors: JSON.parse(colors),
                        });
                        product.save().then(() => {
                            const adminLog = new AdminLog({
                                adminId: req.user._id,
                                action: "Create a new Product",
                                operation: "CREATE",
                                model: "PRODUCT",
                                productId: product._id
                            });
                            adminLog.save().catch((error) => {
                                console.error("Failed to save admin log", error)
                            })
                            res.send({ message: "Product created successfully", flag: 1 });
                        }).catch((error) => {
                            fs.unlinkSync(destination + imageNames)
                            res.send({ message: "Unable to create product", flag: 0, error: error.message });
                        });
                    }
                }
            )
        } catch (error) {

        }
    },
    async getProduct(req, res) {
        const id = req.params.id;
        console.log("id:", id);
        try {
            let showPage
            if (req.query.show) {
                showPage = req.query.show ? Number(req.query.show) : 12;
            }

            if (req.query.limit) {
                showPage = req.query.limit ? Number(req.query.limit) : 12;
            }

            if (id) {
                const product = await Product.findById(id).populate(["category_id", "colors"]);
                res.send({ product, flag: 1, message: "Product Fetched Successfully" });
            } else {
                const filterQuery = {
                    deletedAt: null,
                };

                if (req.query.color) {
                    const colors = req.query.color.split('-');
                    const colorsId = [];
                    for (let color of colors) {
                        const colorData = await Color.findOne({ slug: color });
                        if (colorData) {
                            colorsId.push(colorData._id);
                        }
                    }
                    filterQuery.colors = { $in: colorsId };
                }


                if (req.query.category_slug) {
                    const category = await Category.findOne({ slug: req.query.category_slug });
                    if (category) {
                        filterQuery.category_id = category._id;
                    }
                }

                if (req.query.min && req.query.max) {
                    filterQuery.final_price = {
                        $gte: Number(req.query.min),
                        $lte: Number(req.query.max)
                    };
                }

                if (req.query.status) {
                    filterQuery.status = req.query.status;
                }

                const sortObj = {};
                if (req.query.sortByName) {
                    sortObj.name = Number(req.query.sortByName);
                }

                if (req.query.sortByPrice) {
                    sortObj.final_price = Number(req.query.sortByPrice);
                }

                if (req.query.sortByDate) {
                    sortObj.createdAt = Number(req.query.sortByDate);
                }

                const products = await Product.find(filterQuery).populate(
                    ["category_id", "colors"]
                ).sort(sortObj).limit(showPage);
                res.send({ products, flag: 1, total: products.length, limit: showPage })
            }
        } catch (error) {
            res.send({
                message: "Internal server error",
                flag: 0
            });
        }
    },
    async getProductByIds(req, res) {
        try {
            const ids = req.params.ids.split("-");
            const products = await Product.find({ _id: { $in: ids } }).select('_id name slug final_price original_price main_image');
            res.send({ products, flag: 1 });
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    async toggleStatus(req, res) {
        try {
            const id = req.body.id;
            console.log(id)
            const newStatus = req.body.new_status;
            console.log(newStatus)
            await Product.findByIdAndUpdate(id, { status: newStatus }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: `Change status from ${!newStatus} to ${newStatus}`,
                        operation: "UPDATE",
                        model: "PRODUCT",
                        productId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Status Updated", flag: 1 });
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to Update Status", flag: 0 });
                }
            );
        } catch (error) {
            res.send({ message: "Internal Server Issue", flag: 0 })
        }

    },
    async moveTrash(req, res) {
        try {
            const id = req.params.id;
            await Product.findByIdAndUpdate(id, { deletedAt: new Date() }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Moved the Product to trash",
                        operation: "UPDATE",
                        model: "PRODUCT",
                        productId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Item Moved to Trash", flag: 1 });
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to Move Item in the Trash", flag: 0 });
                }
            );
        } catch (error) {
            res.send(message.error)
            res.send({ message: "Internal Server Issue", flag: 0 })
        }
    },
    async getTrashedProducts(req, res) {
        try {
            const trashProductData = await Product.find({ deletedAt: { $ne: null } }).sort({ createdAt: -1 }).populate(["category_id", "colors"]);
            res.send({ trashProductData, flag: 1, message: "Trashed Products Fetched Successfully" });
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 });

        }
    },
    async undoTrash(req, res) {
        try {
            const id = req.params.id;
            await Product.findByIdAndUpdate(id, { deletedAt: null }).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Undo the Product",
                        operation: "UPDATE",
                        model: "PRODUCT",
                        productId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Product Restored Successfully", flag: 1 });
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to Restore Product", flag: 0 });
                }
            );
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 });

        }
    },
    async deleteProduct(req, res) {
        try {
            const id = req.params.id;
            await Product.findByIdAndDelete(id).then(
                () => {
                    const adminLog = new AdminLog({
                        adminId: req.user._id,
                        action: "Delete the Product",
                        operation: "DELETE",
                        model: "PRODUCT",
                        productId: id
                    });
                    adminLog.save().catch((error) => {
                        console.error("Failed to save admin log", error)
                    })
                    res.send({ message: "Product Deleted Successfully", flag: 1 });
                }
            ).catch(
                () => {
                    res.send({ message: "Unable to Delete Product", flag: 0 });
                }
            );
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 });
        }
    },
    async updateProduct(req, res) {
        console.log("updateProduct called");
        try {
            const { id } = req.params;
            console.log("id:", id);
            const { name, slug, original_price, discount_percentage, final_price, description, category, colors } = req.body;

            if (req.files && req.files.image) {
                const image = req.files.image;
                const destination = "./public/images/products/";
                const imageName = generateFileName(image.name);
                image.mv(
                    destination + imageName,
                    async (error) => {
                        if (error) {
                            res.send({ message: "Unable to Upload Image", flag: 0 });
                        } else {
                            // Update product details in the database
                            await Product.findByIdAndUpdate(id, {
                                name: name,
                                slug: slug,
                                original_price: original_price,
                                discount_percentage: discount_percentage,
                                final_price: final_price,
                                description: description,
                                main_image: imageName,
                                category_id: category,
                                colors: JSON.parse(colors)
                            }).then(
                                () => {
                                    const adminLog = new AdminLog({
                                        adminId: req.user._id,
                                        action: "Update in the Product",
                                        operation: "UPDATE",
                                        model: "PRODUCT",
                                        productId: id
                                    });
                                    adminLog.save().catch((error) => {
                                        console.error("Failed to save admin log", error)
                                    })
                                    res.send({ message: "Product Updated Successfully", flag: 1 });
                                }
                            ).catch(
                                () => {
                                    res.send({ message: "Unable to Update Product", flag: 0 });
                                }
                            );
                        }
                    }
                )

            }
            else {
                await Product.findByIdAndUpdate(id, {
                    name: name,
                    slug: slug,
                    original_price: original_price,
                    discount_percentage: discount_percentage,
                    final_price: final_price,
                    description: description,
                    category_id: category,
                    colors: JSON.parse(colors)
                }).then(
                    () => {
                        res.send({ message: "Product Updated Successfully", flag: 1 });
                    }
                ).catch(
                    () => {
                        res.send({ message: "Unable to Update Product", flag: 0 });
                    }
                );
            }
        } catch (error) {
            console.error("Error updating product:", error);
            res.send({ message: "Internal Server Error", flag: 0, error });
        }
    },
    async getRelatedProducts(req, res) {
        try {
            const { category_id, exclude_id, limit } = req.query;
            // Find products in the same category, excluding the current product
            const query = {
                category_id,
                _id: { $ne: exclude_id },
                deletedAt: null
            };
            const relatedProducts = await Product.find(query)
                .populate(["category_id", "colors"])
                .limit(Number(limit) || 8);
            res.send({ relatedProducts, flag: 1 });
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 });
        }
    },
    async submitReview(req, res) {
        try {
            const id = req.params.id;
            console.log("Request Body", req.body)
            const { user_id, rating, title, comment, recommend, name, email } = req.body;

            console.log("User ID:", user_id);
            const product = await Product.findById(id);
            let newReview = {};
            if (product) {
                newReview = {
                    user: user_id,
                    product: id,
                    rating: rating,
                    comment: comment,
                    title: title,
                    recommend: recommend,
                    createdAt: new Date(),
                }
            }
            product.review.push(newReview);
            await product.save();
            const newProduct = await Product.findById(id).select('review').populate('review.user');
            res.send({ message: "Review Submitted Successfully", flag: 1, newProduct });
        } catch (error) {
            console.error("Error submitting review:", error.message);
            res.send({ message: "Internal Server Error", flag: 0 });
        }
    },
    async getReviews(req, res) {
        try {
            const id = req.params.id;
            const limit = req.query.limit ? parseInt(req.query.limit) : 3;
            console.log("Get Review ID", id)
            const product = await Product.findById(id).select('review').populate('review.user');
            // Slice the reviews array to the requested limit
            const reviews = product?.review?.slice(0, limit) || [];

            console.log("Reviews:", reviews);
            res.send({ reviews, flag: 1 });
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 });
        }
    },
    async getProductBySearch(req, res) {
        try {
            const { search } = req.query;
            const products = await Product.find({ name: { $regex: search, $options: "i" } });
            console.log("Products in search", products)
            res.send({ message: "Product Found", flag: 1, products })
        } catch (error) {
            console.log(error.message)
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    async getTabData(req, res) {
        try {
            const productname = req.params.productname
            const products = await Product.find({ name: { $regex: productname, $options: "i" } });
            // console.log("Products in iphone", products)
            res.send({ message: "Product Found", flag: 1, products })
        } catch (error) {
            console.log("Kya error hai", error.message)
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },
    async getnewarrivals(req, res) {
        try {
            const products = await Product.find({ status: true }).sort({ createdAt: -1 }).limit(8);
            res.send({ message: "New Arrivals Product Fetch Successfully", flag: 1, products })
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    },

    async getProductCount(req, res) {
        try {
            const productCount = await Product.find().countDocuments();
            res.send({ message: "Product Count Fetch Successfull", flag: 1, productCount });
        } catch (error) {
            res.send({ message: "Internal Server Error", flag: 0 })
        }
    }

}

module.exports = ProductController;