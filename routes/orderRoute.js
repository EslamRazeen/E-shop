const express = require("express");

const orderController = require("../controller/orederController");
const authController = require("../controller/authController");

const router = express.Router();

router.use(authController.protect);
router
  .route("/:cartId")
  .post(authController.allowedTo("user"), orderController.createCashOrder);

// You can use "post" too
router.get(
  "/checkout-session/:cartId",
  authController.allowedTo("user"),
  orderController.checkoutSession
);

router
  .route("/")
  .get(
    authController.allowedTo("user", "admin", "manager"),
    orderController.filterOrderForLoggedUser,
    orderController.getAllOrders
  );
router.get("/:id", orderController.getOneOrder);

router.put(
  "/:id/pay",
  authController.allowedTo("admin", "manager"),
  orderController.updateOrderToPaid
);
router.put(
  "/:id/deliver",
  authController.allowedTo("admin", "manager"),
  orderController.updateOrderToDeliverd
);

module.exports = router;
