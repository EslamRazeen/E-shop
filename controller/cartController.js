const asyncHandler = require("express-async-handler");

const cartSchema = require("../models/schemaCart");
const productSchema = require("../models/shemaProduct");
const couponSchema = require("../models/schemaCoupon");
const ApiError = require("../utils/apiError");

const calTotalPriceOfCart = (cart) => {
  // This function for calculation total price of cart and number of product too
  let totalPrice = 0;
  let numOfProductInCarts = 0;

  cart.cartItems.forEach((productItem) => {
    totalPrice += productItem.quantity * productItem.price;
    numOfProductInCarts += productItem.quantity;
  });

  cart.totalCartPrice = totalPrice;

  const arrayOfResults = [totalPrice, numOfProductInCarts];
  return arrayOfResults;
};

const addProductToCart = asyncHandler(async (req, res, next) => {
  //1) Get cart for logged user
  const { productId, color } = req.body;
  let cart = await cartSchema.findOne({ user: req.user._id });
  const product = await productSchema.findById(productId);

  //2) if there is no cart, create cart for logged user
  if (!cart) {
    cart = await cartSchema.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } //3) if there is a cart, check if this product exists or no
  else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    // if product exists in cart, update product quantity
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    }
    // if product not exists in cart, add product to cart
    else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  //4) calculation Total price of cart
  calTotalPriceOfCart(cart);

  // discount only with coupon, like in the applyCouponOnCart handler
  cart.totalPriceAfterDiscount = undefined;

  // After modifying the cart, cart.save() ensures these changes are saved in the database.
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCarts: cart.cartItems.length,
    NumberOfProduct: calTotalPriceOfCart(cart)[1],
    data: cart,
  });
});

const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartSchema.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError(`There aren't any product in your cart`, 404));
  }

  // discount only with coupon, like in the applyCouponOnCart handler
  cart.totalPriceAfterDiscount = undefined;

  res.status(200).json({
    status: "success",
    numberOfcart: cart.cartItems.length,
    NumberOfProduct: calTotalPriceOfCart(cart)[1],
    data: cart,
  });
});

const removeSpecificCart = asyncHandler(async (req, res, next) => {
  const cart = await cartSchema.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  if (!cart) {
    return next(new ApiError(`There aren't any product in your cart`, 404));
  }

  calTotalPriceOfCart(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfcart: cart.cartItems.length,
    NumberOfProduct: calTotalPriceOfCart(cart)[1],
    data: cart,
  });
});

const clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await cartSchema.findOneAndDelete({ user: req.user._id });

  res.status(204).send();
});

const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await cartSchema.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("There is no cart for this user"), 404);
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex > -1) {
    const currentItem = cart.cartItems[itemIndex];
    currentItem.quantity = quantity;
    cart.cartItems[itemIndex] = currentItem;
  } else {
    return next(
      new ApiError(`There is no item for this id: ${req.params.itemId}`),
      404
    );
  }

  // discount only with coupon, like in the applyCouponOnCart handler
  cart.totalPriceAfterDiscount = undefined;

  calTotalPriceOfCart(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCarts: cart.cartItems.length,
    NumberOfProduct: calTotalPriceOfCart(cart)[1],
    data: cart,
  });
});

const applyCouponOnCart = asyncHandler(async (req, res, next) => {
  //1) Get coupon based on coupon name and expire time
  const coupon = await couponSchema.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`, 404));
  }
  //2) Get logged user cart to get total price
  const cart = await cartSchema.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;
  const priceAfterDiscount = totalPrice - (totalPrice * coupon.discount) / 100;

  cart.totalPriceAfterDiscount = priceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCarts: cart.cartItems.length,
    NumberOfProduct: calTotalPriceOfCart(cart)[1],
    data: cart,
  });
});

module.exports = {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCart,
  clearLoggedUserCart,
  updateCartItemQuantity,
  applyCouponOnCart,
};
