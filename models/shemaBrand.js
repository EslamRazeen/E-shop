const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// from this line to line 37, To return image URL in response only and don't change it in database
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brand/${doc.image}`;
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

const schemaModel = mongoose.model("Brand", schema);

module.exports = schemaModel;
