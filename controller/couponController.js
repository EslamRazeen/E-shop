const factory = require("./handelersFactory");
const couponSchema = require("../models/schemaCoupon");

const createCoupon = factory.createOne(couponSchema);
const getAllCoupons = factory.getAll(couponSchema);
const getOneCoupon = factory.getOne(couponSchema);
const updateCoupon = factory.updateOne(couponSchema);
const deleteCoupon = factory.deleteOne(couponSchema);

module.exports = {
  createCoupon,
  getAllCoupons,
  getOneCoupon,
  updateCoupon,
  deleteCoupon,
};
