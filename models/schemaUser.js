const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: [6, "Too short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordExpiredCode: Date,
    passwordVerifiedCode: Boolean,
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // child reference (one to many)
    // wishlist is array
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

user.pre("save", async function (next) {
  // Hashing password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", user);
