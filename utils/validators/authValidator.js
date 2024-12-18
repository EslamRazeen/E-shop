const slugify = require("slugify");
const { check } = require("express-validator");

const validator = require("../../middlewares/validatorMiddleware");
const UserSchema = require("../../models/schemaUser");

const singupValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
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
    .withMessage("This is not email")
    .custom(async (val) => {
      const user = await UserSchema.findOne({ email: val });
      if (user) {
        throw new Error("This email in use");
      }
      return true;
    }),
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
  validator,
];

const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("This is not email"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4 })
    .withMessage("Too short User password"),
  validator,
];

module.exports = {
  singupValidator,
  loginValidator,
};
