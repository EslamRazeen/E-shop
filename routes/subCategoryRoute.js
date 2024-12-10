const express = require("express");

// Without { mergeParams: true }, Child router(subCategory) won't have access to parameters in the parent(category).
const router = express.Router({ mergeParams: true });

const controllerSubCategory = require("../controller/subCategoryController");

const validatorMiddleware = require("../utils/validators/subCategoryValidator");

const authController = require("../controller/authController");

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    controllerSubCategory.setCategoryIDtoBody,
    validatorMiddleware.createProductValidator,
    controllerSubCategory.creatSubCategory
  )
  .get(
    controllerSubCategory.createFilterObject,
    controllerSubCategory.getSubCategories
  );

router
  .route("/:id")
  .get(
    validatorMiddleware.getSubCategoryValidator,
    controllerSubCategory.getSubCategory
  )
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    validatorMiddleware.updateCategoryValidator,
    controllerSubCategory.updateSubCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    validatorMiddleware.deleteCategoryValidator,
    controllerSubCategory.deleteSubCategory
  );

module.exports = router;
