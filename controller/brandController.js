const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const schemaBrand = require("../models/shemaBrand");
const factory = require("./handelersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// upload single image
const uploadBrandImage = uploadSingleImage("image");

// image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brand/${fileName}`);

    // save image in our database
    req.body.image = fileName;
  }

  next();
});

const createBrand = factory.createOne(schemaBrand);
// const createBrand = asyncHandler(async (req, res) => {
//   const { name } = req.body;
//   const newBrand = await schemaBrand.create({
//     name,
//     slug: slugify(name),
//   });
//   res.status(201).json({ data: newBrand });
// });

const getBrands = factory.getAll(schemaBrand);
// const getBrands = asyncHandler(async (req, res) => {
//   // Build Query
//   const documentCount = await schemaBrand.countDocuments(); // count the number of documents in database
//   const apiFeatures = new ApiFeatures(schemaBrand.find(), req.query)
//     .paginate(documentCount)
//     .filter()
//     .limitFields()
//     .sort()
//     .search();

//   // Execute Query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const brands = await mongooseQuery;

//   res
//     .status(200)
//     .json({ reslut: brands.length, paginationResult, data: brands });
// });

const getBrand = factory.getOne(schemaBrand);
// const getBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params; // = const id = req.params.id
//   const brand = await schemaBrand.findById(id);

//   if (!brand) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

const updateBrand = factory.updateOne(schemaBrand);
// const updateBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   const brand = await schemaBrand.findOneAndUpdate(
//     { _id: id },
//     { name, slug: slugify(name) },
//     { new: true }
//   );

//   if (!brand) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(200).json({ data: brand });
// });

const deleteBrand = factory.deleteOne(schemaBrand);
// const deleteBrand = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const brand = await schemaBrand.findByIdAndDelete(id);

//   if (!brand) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(204).send();
// });

module.exports = {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
};
