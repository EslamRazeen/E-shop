const express = require("express");

const wishlistController = require("../controller/wishlistController");
const authController = require("../controller/authController");

const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"));
router
  .route("/")
  .post(wishlistController.addProductToWishlist)
  .get(wishlistController.getLoggedUserWishlist);

router.delete("/:productId", wishlistController.removeProductFromWishlist);

module.exports = router;
