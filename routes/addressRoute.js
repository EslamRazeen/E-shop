const express = require("express");

const addressController = require("../controller/addressController");
const authController = require("../controller/authController");

const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"));
router
  .route("/")
  .post(addressController.addAddress)
  .get(addressController.getLoggedUserAddresses);

router.delete("/:addressId", addressController.removeAddress);

module.exports = router;
