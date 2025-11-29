const express = require('express');
const productController = require('../controllers/product.controller');
const fileUpload = require('express-fileupload');
const ProductController = require('../controllers/product.controller');
const authorizationMiddleware = require('../middlewares/authorization');

const ProductRouter = express.Router();

// Create a new product

ProductRouter.post('/create',
    fileUpload({
        createParentPath: true,
    }),
    authorizationMiddleware,
    productController.createProduct);

ProductRouter.get("/get-data", productController.getProduct);

ProductRouter.get("/get-data/:id", productController.getProduct);

ProductRouter.post("/upload-other-images/:pId", authorizationMiddleware, fileUpload({ createParentPath: true }), productController.uploadOtherImages);

ProductRouter.delete("/delete-images/:pId/:image_index", authorizationMiddleware, productController.deleteOtherImage);

ProductRouter.patch("/change_status", authorizationMiddleware, ProductController.toggleStatus);

ProductRouter.patch("/move-to-trash/:id", authorizationMiddleware, ProductController.moveTrash);

ProductRouter.get("/get-trashed", ProductController.getTrashedProducts);

ProductRouter.patch("/undo/:id", authorizationMiddleware, ProductController.undoTrash);

ProductRouter.delete("/delete/:id", authorizationMiddleware, ProductController.deleteProduct);

ProductRouter.put("/update/:id", authorizationMiddleware, fileUpload({ createParentPath: true }), ProductController.updateProduct);

ProductRouter.get("/get-data-by-ids/:ids", productController.getProductByIds);

ProductRouter.get("/get-related-products", productController.getRelatedProducts);

ProductRouter.post("/submit-review/:id", productController.submitReview);

ProductRouter.get("/get-reviews/:id", productController.getReviews);

ProductRouter.get("/get-product/search", productController.getProductBySearch);

ProductRouter.get("/store/get-data/:productname", productController.getTabData);

ProductRouter.get("/new-arrivals", productController.getnewarrivals);

ProductRouter.get("/product-count", productController.getProductCount)

module.exports = ProductRouter;