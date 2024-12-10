const multer = require("multer");
const ApiError = require("../utils/apiError");

// 1 DiskStorage engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/category");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });

// 2 MemoryStorage engine
exports.uploadSingleImage = (fieldName) => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images allowed", 400));
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.single(fieldName);
};

exports.uploadMixOfImage = (arrayOfFields) => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images allowed", 400));
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.fields(arrayOfFields);
};
