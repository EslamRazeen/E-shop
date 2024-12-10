const slugify = require("slugify");
const { check, body } = require("express-validator");
const validator = require("../../middlewares/validatorMiddleware");
const CategorySchema = require("../../models/shemaCategory");

const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID"),
  validator,
];

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .custom(async (val) => {
      const category = await CategorySchema.findOne({ name: val });
      if (category) {
        throw new Error("This category already exist");
      }
    }),
  validator,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID"),
  validator,
];

module.exports = {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
