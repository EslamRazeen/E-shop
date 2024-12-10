const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const orderSchema = require("../models/schemaOrder");
const cartSchema = require("../models/schemaCart");
const productSchema = require("../models/shemaProduct");
const factory = require("./handelersFactory");
const { concurrency } = require("sharp");

const createCashOrder = asyncHandler(async (req, res, next) => {
  // App settings, added by admin
  const taxPrice = 0;
  const shippingPrice = 0;

  //1) Get cart based on cartId in params
  const cart = await cartSchema.findById(req.params.cartId);
  if (!cart)
    return next(
      new ApiError(`There is no cart with this id: ${req.params.cartId}`, 404)
    );

  //2) Get order price based on cart price, "Check if coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount // if totalPriceAfterDiscount !== undefiend => cartPrice = cart.totalPriceAfterDiscount
    : cart.totalCartPrice; //else cartPrice = cart.totalCartPrice

  const orderPrice = cartPrice + taxPrice + shippingPrice;

  //3) Create order with default payment method "cash"
  const order = await orderSchema.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: orderPrice,
  });

  if (order) {
    //4) After creating order, decrement product quantity, increment product sold
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    })); // Look at boghdady course (video 168)
    await productSchema.bulkWrite(bulkOption, {}); // The bulkWrite() method performs a lot of operations against a single collection, like(insertOne, updateOne, updateMany, deleteOne, deleteMany, replaceOne)

    //5) Clear cart depend on cartId
    await cartSchema.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});

const filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

const getAllOrders = factory.getAll(orderSchema);

const getOneOrder = factory.getOne(orderSchema);

const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderSchema.findById(req.params.id);

  order.isPaid = true;
  order.paidAt = Date.now();

  const orderAfterPaid = await order.save();

  res.status(200).json({ status: "success", data: orderAfterPaid });
});

const updateOrderToDeliverd = asyncHandler(async (req, res, next) => {
  const order = await orderSchema.findById(req.params.id);

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const orderAfterDelivered = await order.save();

  res.status(200).json({ status: "success", data: orderAfterDelivered });
});

// Get checkout session from stripe and send it as response
// The main goal of this handler is associate with stripe to create session and send this session to frontend , with this session the frontend who has public key can open the payment page
const checkoutSession = asyncHandler(async (req, res, next) => {
  // App settings, added by admin
  const taxPrice = 0;
  const shippingPrice = 0;

  //1) Get cart based on cartId in params
  const cart = await cartSchema.findById(req.params.cartId);
  if (!cart)
    return next(
      new ApiError(`There is no cart with this id: ${req.params.cartId}`, 404)
    );

  //2) Get order price based on cart price, "Check if coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount // if totalPriceAfterDiscount !== undefiend => cartPrice = cart.totalPriceAfterDiscount
    : cart.totalCartPrice; //else cartPrice = cart.totalCartPrice

  const orderPrice = cartPrice + taxPrice + shippingPrice;

  //3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    // line_items: [
    //   {
    //     name: req.user.name,
    //     amount: orderPrice * 100, // ضربنا في 100 عشان سترايب بتخلي الرقم يرجع لورا مرتين يعني لو 11 بتخليها 0.11
    //     currency: "egp",
    //     quantity: 1,
    //   },
    // ],
    line_items: [
      {
        price_data: {
          currency: "egp", // Your currency code
          product_data: {
            name: req.user.name, // Product or service name
            description: "Product description here", // Optional
          },
          unit_amount: orderPrice * 100, // Amount in smallest currency unit (cents)
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/order`, // in case of succes go to order page
    cancel_url: `${req.protocol}://${req.get("host")}/cart`, // in case of cancel go to cart page again
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  //4) Send session to response
  res.status(200).json({ status: "success", session });
});

module.exports = {
  createCashOrder,
  getAllOrders,
  getOneOrder,
  filterOrderForLoggedUser,
  updateOrderToDeliverd,
  updateOrderToPaid,
  checkoutSession,
};
