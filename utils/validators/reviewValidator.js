const { check } = require("express-validator");
const validator = require("../../middlewares/validatorMiddleware");
const reviewSchema = require("../../models/schemaReview");

const createReviewValidator = [
  check("comment").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  check("user").isMongoId().withMessage("Invalid User ID"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Product ID")
    .custom((val, { req }) =>
      // check if user make review on this product before
      reviewSchema
        .findOne({ user: req.user._id, product: req.body.product })
        .then((review) => {
          if (review) {
            return Promise.reject(
              new Error("This user maked review on this product before")
            );
          }
        })
    ),
  validator,
];

const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .custom((val, { req }) =>
      reviewSchema.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error("There is no review on this product before")
          );
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          //toString() becuase review.user id return object id
          return Promise.reject(new Error("You can't update this review"));
        }
      })
    ),
  validator,
];

const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .custom((val, { req }) =>
      reviewSchema.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error("There is no review on this product before")
          );
        }
        if (req.user.role === "user") {
          if (review.user._id.toString() !== req.user._id.toString()) {
            //toString() becuase review.user id return object id
            return Promise.reject(new Error("You can't delete this review"));
          }
        }
      })
    ),
  validator,
];

const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review ID"),
  validator,
];

module.exports = {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
};
