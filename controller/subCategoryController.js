// const asyncHandler = require("express-async-handler");
// const slugify = require("slugify");
const schemaSubCategory = require("../models/shemaSubCategory");
// const ApiError = require("../utils/apiError");
const shemaSubCategory = require("../models/shemaSubCategory");
// const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handelersFactory");

// Nested route
const setCategoryIDtoBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryID;
  next();
};

// Nested route
const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryID) {
    filterObject = { category: req.params.categoryID };
  }
  req.filterObj = filterObject;
  next();
};
const creatSubCategory = factory.createOne(schemaSubCategory);
// const creatSubCategory = asyncHandler(async (req, res) => {
//   const { name, category } = req.body;

//   const newSubCategory = await schemaSubCategory.create({
//     name,
//     slug: slugify(name),
//     category,
//   });

//   res.status(201).json({ data: newSubCategory });
// });

const getSubCategories = factory.getAll(schemaSubCategory);
// const getSubCategories = asyncHandler(async (req, res) => {
//   // Build Query
//   const documentCount = await shemaSubCategory.countDocuments(); // count the number of documents in database
//   const apiFeatures = new ApiFeatures(shemaSubCategory.find(req.filterObj), req.query)
//     .paginate(documentCount)
//     .filter()
//     .limitFields()
//     .sort()
//     .search();

//   // Execute Query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const subCategories = await mongooseQuery;

//   res.status(200).json({
//     reslut: subCategories.length,
//     paginationResult,
//     data: subCategories,
//   });
// });

const getSubCategory = factory.getOne(schemaSubCategory);
// const getSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const subCategory = await schemaSubCategory.findById(id);
//   // .populate({ path: "category", select: "name -_id" });

//   if (!subCategory) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(200).json({ data: subCategory });
// });

const updateSubCategory = factory.updateOne(shemaSubCategory);
// const updateSubCategory = asyncHandler(async (req, res, next) => {

//   const subCategory = await shemaSubCategory.findByIdAndUpdate(
//     req.body.id,
//     req.body,
//     { new: true }
//   );

//   if (!subCategory) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(200).json({ data: subCategory });
// });

const deleteSubCategory = factory.deleteOne(shemaSubCategory);
// const deleteSubCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const subCategory = await shemaSubCategory.findByIdAndDelete(id);

//   if (!subCategory) {
//     return next(new ApiError(`This id (${id}) not found`, 404));
//   }
//   res.status(200).send();
// });

module.exports = {
  creatSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIDtoBody,
  createFilterObject,
};
