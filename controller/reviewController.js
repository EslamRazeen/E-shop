const factory = require("./handelersFactory");
const ReviewSchema = require("../models/schemaReview");

// Nested route(Create reviews for specific product)
const setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// Nested route(Get reviews for specific product)
const createfilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

const createReview = factory.createOne(ReviewSchema);
const getReviews = factory.getAll(ReviewSchema);
const getOneReview = factory.getOne(ReviewSchema);
const UpdateReview = factory.updateOne(ReviewSchema);
const deletReview = factory.deleteOne(ReviewSchema);

module.exports = {
  createReview,
  getReviews,
  getOneReview,
  UpdateReview,
  deletReview,
  createfilterObject,
  setProductIdAndUserIdToBody,
};
