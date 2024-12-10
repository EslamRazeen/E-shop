const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
// const slugify = require("slugify");
const schemaUser = require("../models/schemaUser");
const ApiError = require("../utils/apiError");
// const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handelersFactory");

const createUser = factory.createOne(schemaUser);

const getUsers = factory.getAll(schemaUser);

const getUser = factory.getOne(schemaUser);

const updateUser = asyncHandler(async (req, res, next) => {
  const documents = await schemaUser.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!documents) {
    return next(new ApiError(`This id "${req.body.id}" not found`, 404));
  }
  res.status(200).json({ data: documents });
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const documents = await schemaUser.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!documents) {
    return next(new ApiError(`This id "${req.body.id}" not found`, 404));
  }
  res.status(200).json({ data: documents });
});

const deleteUser = factory.deleteOne(schemaUser);

const getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

const updatePasswordLoggedUser = asyncHandler(async (req, res, next) => {
  const loggedUser = await schemaUser.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.NewPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = jwt.sign(
    { userID: loggedUser._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.TOKEN_EXPITRE,
    }
  );

  res.status(200).json({ data: loggedUser, token });
});

const updateLoggedUser = asyncHandler(async (req, res, next) => {
  const loggedUser = await schemaUser.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    }
  );
  res.status(200).json({ data: loggedUser });
});

const deactivateLoggedUser = asyncHandler(async (req, res, next) => {
  await schemaUser.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  res.status(204).json({ message: "Your account is deativate" });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  getLoggedUser,
  updatePasswordLoggedUser,
  updateLoggedUser,
  deactivateLoggedUser,
};
