const slugify = require("slugify");
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const validator = require("../../middlewares/validatorMiddleware");
const UserSchema = require("../../models/schemaUser");
const ApiError = require("../apiError");

const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  validator,
];

const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      UserSchema.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Too short password")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirm incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm is required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, Only EGY or SA phone numbers"),
  check("profileImage").optional(),
  check("role").optional(),

  validator,
];

const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      UserSchema.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, Only EGY or SA phone numbers"),
  check("profileImage").optional(),
  check("role").optional(),
  validator,
];

const updatePassword = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current Password Is Required")
    .custom(async (val, { req }) => {
      const user = await UserSchema.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this ID");
      }
      const isCorrectPass = await bcrypt.compare(val, user.password);
      if (!isCorrectPass) {
        throw new Error("Current Password Incorrect");
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password Is Required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirmation Is Required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password Confirmation Incorrect");
      }
      return true;
    }),
  validator,
];

const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  validator,
];

const updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      UserSchema.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, Only EGY or SA phone numbers"),
  check("profileImage").optional(),
  validator,
];

const updateLoggedUserPassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current Password Is Required")
    .custom(async (val, { req }) => {
      const isCorrectPass = await bcrypt.compare(val, req.user.password);
      if (!isCorrectPass) {
        throw new Error("Current Password Incorrect");
      }
      return true;
    }),
  body("NewPassword").notEmpty().withMessage("Password Is Required"),
  body("NewPasswordConfirm")
    .notEmpty()
    .withMessage("Password Confirmation Is Required")
    .custom((val, { req }) => {
      if (val !== req.body.NewPassword) {
        throw new Error("Password Confirmation Incorrect");
      }
      return true;
    }),
  validator,
];

module.exports = {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updatePassword,
  updateLoggedUserValidator,
  updateLoggedUserPassword,
};
