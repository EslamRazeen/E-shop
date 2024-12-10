const express = require("express");
const controllerBrand = require("../controller/brandController");
const BrandValidator = require("../utils/validators/brandValidator");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    controllerBrand.uploadBrandImage,
    controllerBrand.resizeImage,
    BrandValidator.createBrandValidator,
    controllerBrand.createBrand
  )
  .get(controllerBrand.getBrands);

router
  .route("/:id")
  .get(BrandValidator.getBrandValidator, controllerBrand.getBrand)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    controllerBrand.uploadBrandImage,
    controllerBrand.resizeImage,
    BrandValidator.updateBrandValidator,
    controllerBrand.updateBrand
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    BrandValidator.deleteBrandValidator,
    controllerBrand.deleteBrand
  );

module.exports = router;
