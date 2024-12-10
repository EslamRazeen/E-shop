// const asyncHandler = require("express-async-handler");
// const slugify = require("slugify");
// const ApiError = require("../utils/apiError");
// const ApiFeatures = require("../utils/apiFeatures");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const schemaCategory = require("../models/shemaCategory");
const factory = require("./handelersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// upload single image
const uploadCategoryImage = uploadSingleImage("image");

// image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    // if i don't upload image
    return next();
  }

  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/category/${fileName}`);

  // save image in our database
  req.body.image = fileName;

  next();
});

const createCategory = factory.createOne(schemaCategory);
// const createCategory = asyncHandler(async (req, res) => {
//   const name = req.body.name;
//   const newCategory = await schemaCategory.create({
//     name,
//     slug: slugify(name),
//   });
//   res.status(201).json({ data: newCategory });
// });

const getCategories = factory.getAll(schemaCategory);
// const getCategories = asyncHandler(async (req, res) => {
//   // Build Query
//   const documentCount = await schemaCategory.countDocuments(); // count the number of documents in database
//   const apiFeatures = new ApiFeatures(schemaCategory.find(), req.query)
//     .paginate(documentCount)
//     .filter()
//     .limitFields()
//     .sort()
//     .search();

//   // Execute Query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const categories = await mongooseQuery;

//   res
//     .status(200)
//     .json({ reslut: categories.length, paginationResult, data: categories });
// });

const getCategory = factory.getOne(schemaCategory);
// const getCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params; // = const id = req.params.id
//   const category = await schemaCategory.findById(id);

//   if (!category) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(200).json({ data: category });
// });

const updateCategory = factory.updateOne(schemaCategory);
// const updateCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   const category = await schemaCategory.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     { new: true }
//   );

//   if (!category) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(200).json({ data: category });
// });

const deleteCategory = factory.deleteOne(schemaCategory);
// const deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await schemaCategory.findByIdAndDelete(id);

//   if (!category) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(204).send();
// });

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
};
