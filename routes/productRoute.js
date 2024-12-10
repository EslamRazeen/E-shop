const express = require("express");
const controllerProduct = require("../controller/productController");
const ProductValidator = require("../utils/validators/productValidator");
const authController = require("../controller/authController");
const reviewRoute = require("./reviewRoute");

const router = express.Router();

// Nested Route
// localhost:8000/api/v1/product/66d08ea2396f3e1cc1a7db01/review
router.use("/:productId/review", reviewRoute);

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    controllerProduct.uploadproductImage,
    controllerProduct.resizeImageCover,
    ProductValidator.createProductValidator,
    controllerProduct.createProduct
  )
  .get(controllerProduct.getProducts);

router
  .route("/:id")
  .get(ProductValidator.getProductValidator, controllerProduct.getProduct)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    ProductValidator.updateProductValidator,
    controllerProduct.updateProduct
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    ProductValidator.deleteProductValidator,
    controllerProduct.deleteProduct
  );

module.exports = router;
