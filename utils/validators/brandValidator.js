const slugify = require("slugify");
const { check, body } = require("express-validator");
const validator = require("../../middlewares/validatorMiddleware");

const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  validator,
];

const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID"),
  validator,
];

module.exports = {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
