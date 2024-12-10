const express = require("express");

const router = express.Router();

const authController = require("../controller/authController");
const authValidator = require("../utils/validators/authValidator");

router
  .route("/signup")
  .post(authValidator.singupValidator, authController.signup);

router.route("/login").post(authValidator.loginValidator, authController.login);

// router.route("/forgotPassword").post(authController.forgotPassword);

module.exports = router;
