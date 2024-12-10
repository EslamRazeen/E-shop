const slugify = require("slugify");
const { check, body } = require("express-validator");
const validator = require("../../middlewares/validatorMiddleware");

const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory ID"),
  validator,
];

const createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Please enter your name")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 42 })
    .withMessage("Too long subCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("Please enter a category id")
    .isMongoId()
    .withMessage("Inavaid category id format"),
  validator,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory ID"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validator,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory ID"),
  validator,
];

module.exports = {
  createProductValidator,
  getSubCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
