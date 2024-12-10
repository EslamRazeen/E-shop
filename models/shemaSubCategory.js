const mongoose = require("mongoose");

const subCategory = new mongoose.Schema(
  {
    name: {
      type: String,
      tirm: true, // remove spaces
      required: true,
      // minlength: [true, "Too short sub category name"],
      // maxlength: [true, "Too long sub category name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Sub category must belong to parent category"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategory);
