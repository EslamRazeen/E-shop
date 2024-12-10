const mongoose = require("mongoose");

const productSchema = require("../models/shemaProduct");

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "Min Ratings Value Is 1.0"],
      max: [5, "Max Ratings Value Is 5.0"],
      required: [true, "Ratings is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    // Parent reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

// Aggregation ,    I want calculate average ratings of product and its quantity
// For details, Go to ===> boghdady course (video 140)
reviewSchema.statics.calcAverageratingsAndQuantity = async function (
  productID
) {
  const result = await this.aggregate([
    // 1) Get all reviews in specific product
    { $match: { product: productID } },
    // 1) Grouping reviews based on productID and cal average ratings and quantity
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$rating" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);
  // console.log(result);
  if (result.length > 0) {
    await productSchema.findOneAndUpdate(productID, {
      ratingsAverage: result[0].avgRatings,
      ratingQuantity: result[0].ratingQuantity,
    });
  } else {
    await productSchema.findOneAndUpdate(productID, {
      ratingsAverage: 0,
      ratingQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageratingsAndQuantity(this.product);
});

reviewSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    // Use the Review model explicitly
    await mongoose.model("Review").calcAverageratingsAndQuantity(doc.product);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
