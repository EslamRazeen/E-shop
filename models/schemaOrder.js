const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethoType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email" }).populate({
    path: "cartItems.product",
    select: "title",
  });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
