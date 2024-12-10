const express = require("express");

const cartController = require("../controller/cartController");
const authController = require("../controller/authController");

const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"));
router
  .route("/")
  .post(cartController.addProductToCart)
  .get(cartController.getLoggedUserCart)
  .delete(cartController.clearLoggedUserCart);

router.put("/applyCoupon", cartController.applyCouponOnCart);

router
  .route("/:itemId")
  .put(cartController.updateCartItemQuantity)
  .delete(cartController.removeSpecificCart); // In this case there is not diffirence between delete or put because is used $pull in handler

module.exports = router;
