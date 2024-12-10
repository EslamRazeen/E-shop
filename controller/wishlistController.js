const asyncHandler = require("express-async-handler");

const schemaUser = require("../models/schemaUser");

// $addToSet and $pull are operators in MongoDB to modify arrays
const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await schemaUser.findByIdAndUpdate(
    req.user._id,
    {
      // $addToSet => add product to wishlist array only once
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added succefully to wishlist",
    data: user.wishlist,
  });
});

const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await schemaUser.findByIdAndUpdate(
    req.user._id,
    {
      // $pull => remove product from wishlist array if exists
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed succefully from wishlist",
    data: user.wishlist,
  });
});

const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  // .populate("wishlist") => the result will return the entire product document, not just product ID.
  const user = await schemaUser.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    resultes: user.wishlist.length,
    data: user.wishlist,
  });
});

module.exports = {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
};
