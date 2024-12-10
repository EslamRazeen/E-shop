const express = require("express");
const controllerCategory = require("../controller/category");
const CategoryValidator = require("../utils/validators/categoryValidator");
const authController = require("../controller/authController");

const router = express.Router();

const subCategories = require("./subCategoryRoute");

// nested route
router.use("/:categoryID/subCategory", subCategories);

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    controllerCategory.uploadCategoryImage,
    controllerCategory.resizeImage,
    CategoryValidator.createCategoryValidator,
    controllerCategory.createCategory
  )
  .get(controllerCategory.getCategories);

router
  .route("/:id")
  .get(CategoryValidator.getCategoryValidator, controllerCategory.getCategory)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    controllerCategory.uploadCategoryImage,
    controllerCategory.resizeImage,
    CategoryValidator.updateCategoryValidator,
    controllerCategory.updateCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    CategoryValidator.deleteCategoryValidator,
    controllerCategory.deleteCategory
  );

module.exports = router;
