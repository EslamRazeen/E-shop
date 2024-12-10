const slugify = require("slugify");
const { check, body } = require("express-validator");
const validator = require("../../middlewares/validatorMiddleware");
const schemaCategory = require("../../models/shemaCategory");
const schemaSubCategory = require("../../models/shemaSubCategory");
const shemaSubCategory = require("../../models/shemaSubCategory");

const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars")
    .notEmpty()
    .withMessage("Title is required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Descrioption is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),
  check("sold").optional().isNumeric().withMessage("Sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isNumeric({ max: 90000000 }),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be array of strings"),
  check("imageCover").notEmpty().withMessage("Image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be array of strings"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Inavalid ID format")
    .custom((categoryID) =>
      schemaCategory.findById(categoryID).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryID}`)
          );
        }
      })
    ),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((subCategoriesIDs) =>
      schemaSubCategory
        .find({ _id: { $exists: true, $in: subCategoriesIDs } })
        .then((result) => {
          if (result.length !== subCategoriesIDs.length) {
            return Promise.reject(new Error(`Invalid subCategories IDs`));
          }
        })
    )
    .custom((subCategoriesIDs, { req }) =>
      shemaSubCategory.find({ category: req.body.category }).then((result) => {
        const subIDs = [];
        result.forEach((ele) => {
          subIDs.push(ele._id.toString());
        });
        if (!subCategoriesIDs.every((v) => subIDs.includes(v))) {
          return Promise.reject(
            new Error(`subCategories IDs not belong to the main category`)
          );
        }
      })
    ),
  check("brand").optional().isMongoId().withMessage("Invalid ID format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings average must be a number")
    .isNumeric({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isNumeric({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Rating quantity must be a number"),

  validator,
];

const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validator,
];

const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];

const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validator,
];

module.exports = {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
