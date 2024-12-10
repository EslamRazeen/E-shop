const express = require("express");

const reviewController = require("../controller/reviewController");

const reviewValidator = require("../utils/validators/reviewValidator");

const authController = require("../controller/authController");

// Without { mergeParams: true }, Child router(review) won't have access to parameters in the parent(product).
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.createfilterObject, reviewController.getReviews)
  .post(
    authController.protect,
    authController.allowedTo("user"),
    reviewController.setProductIdAndUserIdToBody,
    reviewValidator.createReviewValidator,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewValidator.getReviewValidator, reviewController.getOneReview)
  .put(
    authController.protect,
    reviewValidator.updateReviewValidator,
    authController.allowedTo("user"),
    reviewController.UpdateReview
  )
  .delete(
    authController.protect,
    authController.allowedTo("user", "manager", "admin"),
    reviewValidator.deleteReviewValidator,
    reviewController.deletReview
  );

module.exports = router;
