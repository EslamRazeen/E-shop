const mongoose = require("mongoose");

const product = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate Reviews On Product
product.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
product.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" });
  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/product/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }

  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((element) => {
      const imageUrl = `${process.env.BASE_URL}/product/${element}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
// intit in getOne, getAll and update
product.post("init", (doc) => {
  setImageUrl(doc);
});
// save in create
product.post("save", (doc) => {
  setImageUrl(doc);
});
module.exports = mongoose.model("Product", product);
