const asyncHandler = require("express-async-handler");

const schemaUser = require("../models/schemaUser");

// $addToSet and $pull are operators in MongoDB to modify arrays
const addAddress = asyncHandler(async (req, res, next) => {
  const user = await schemaUser.findByIdAndUpdate(
    req.user._id,
    {
      // $addToSet => add address to user address array only once
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

const removeAddress = async (req, res, next) => {
  const user = await schemaUser.findByIdAndUpdate(
    req.user._id,
    {
      // $pull => remove address from user address array if exists
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully",
    data: user.addresses,
  });
};

const getLoggedUserAddresses = async (req, res, next) => {
  const user = await schemaUser.findById(req.user._id).populate("addresses");

  // .populate("wishlist") => the result will return the entire product document, not just product ID.
  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
};

module.exports = {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
};
