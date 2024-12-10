const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// from this line to line 35, To return image URL in response only and don't change it in database
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
    doc.image = imageUrl;
  }
};
// intit in getOne, getAll and update
schema.post("init", (doc) => {
  setImageUrl(doc);
});
// save in create
schema.post("save", (doc) => {
  setImageUrl(doc);
});

const schemaModel = mongoose.model("Category", schema);

module.exports = schemaModel;
