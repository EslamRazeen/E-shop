const express = require("express");
const controllerUser = require("../controller/userController");
const userValidator = require("../utils/validators/userValidator");
const authController = require("../controller/authController");

const router = express.Router();

// Logged user
router.use(authController.protect); // its jop make this middleware(authController.protect) in all routes below, بدل ما اكتبهم قبل كل راوت
router.get("/getMe", controllerUser.getLoggedUser, controllerUser.getUser);
router.put(
  "/changeMyPassweord",
  userValidator.updateLoggedUserPassword,
  controllerUser.updatePasswordLoggedUser
);
router.put(
  "/updateMe",
  userValidator.updateLoggedUserValidator,
  controllerUser.updateLoggedUser
);
router.delete("/deativateMe", controllerUser.deactivateLoggedUser);

// Admin
router.use(authController.allowedTo("admin")); // its jop make this middleware(authController.allowedTo("admin")) in all routes below, بدل ما اكتبهم قبل كل راوت
router.put(
  "/changePassword/:id",
  userValidator.updatePassword,
  controllerUser.updatePassword
);
router
  .route("/")
  .post(userValidator.createUserValidator, controllerUser.createUser)
  .get(controllerUser.getUsers);

router
  .route("/:id")
  .get(userValidator.getUserValidator, controllerUser.getUser)
  .put(userValidator.updateUserValidator, controllerUser.updateUser)
  .delete(userValidator.deleteUserValidator, controllerUser.deleteUser);

module.exports = router;
