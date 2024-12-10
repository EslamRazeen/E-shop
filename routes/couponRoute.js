const express = require("express");

const couponController = require("../controller/couponController");
const authController = require("../controller/authController");

const router = express.Router();

router.use(
  authController.protect,
  authController.allowedTo("admin", "manager")
);
router
  .route("/")
  .post(couponController.createCoupon)
  .get(couponController.getAllCoupons);

router
  .route("/:id")
  .get(couponController.getOneCoupon)
  .put(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

module.exports = router;
