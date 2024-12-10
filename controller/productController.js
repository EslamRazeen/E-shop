const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
// const slugify = require("slugify");
// const multer = require("multer");
// const ApiError = require("../utils/apiError");
const schemaProduct = require("../models/shemaProduct");
const factory = require("./handelersFactory");
const { uploadMixOfImage } = require("../middlewares/uploadImageMiddleware");

const uploadproductImage = uploadMixOfImage([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 4 },
]);

const resizeImageCover = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/product/${imageCoverName}`);

    // save image in our database
    req.body.imageCover = imageCoverName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(500, 500)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/product/${imageName}`);

        // Save images into our db
        req.body.images.push(imageName); //
      })
    );
  }

  // console.log(req.body.imageCover);
  // console.log(req.body.images);
  next();
});

const createProduct = factory.createOne(schemaProduct);
// const createProduct = asyncHandler(async (req, res) => {
//   req.body.slug = slugify(req.body.title);
//   const newProduct = await schemaProduct.create(req.body);
//   res.status(201).json({ data: newProduct });
// });

const getProducts = factory.getAll(schemaProduct);
// const getProducts = asyncHandler(async (req, res) => {
//   // Build Query
//   const documentCount = await shemaProduct.countDocuments(); // count the number of documents in database
//   const apiFeatures = new ApiFeatures(schemaProduct.find(), req.query)
//     .paginate(documentCount)
//     .filter()
//     .limitFields()
//     .sort()
//     .search("Products");

//   // Execute Query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const products = await mongooseQuery;

//   res
//     .status(200)
//     .json({ reslut: products.length, paginationResult, data: products });
// });

const getProduct = factory.getOne(schemaProduct, "reviews");
// const getProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params; // = const id = req.params.id
//   const product = await schemaProduct
//     .findById(id)
//     .populate({ path: "category", select: "name -_id" });

//   if (!product) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(200).json({ data: product });
// });

const updateProduct = factory.updateOne(schemaProduct);
// const updateProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   if (req.body.title) {
//     req.body.slug = slugify(req.body.title);
//   }

//   const product = await schemaProduct.findOneAndUpdate({ _id: id }, req.body, {
//     new: true,
//   });

//   if (!product) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(200).json({ data: product });
// });

const deleteProduct = factory.deleteOne(schemaProduct);
// const deleteProduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await schemaProduct.findByIdAndDelete(id);

//   if (!product) {
//     return next(new ApiError(`This id "${id}" not found`, 404));
//   }
//   res.status(204).send();
// });

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadproductImage,
  resizeImageCover,
};
