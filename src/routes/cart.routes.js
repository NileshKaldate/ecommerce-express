import express from "express";
import {
  addToCartController,
  getAllCartProducts,
  removeFromCartController,
  updateProductQuantityController,
} from "../controllers/cart.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const CartRoutes = express.Router();

CartRoutes.route("/cart/add").post(authUser, addToCartController);
CartRoutes.route("/cart/delete/:productId").delete(
  authUser,
  removeFromCartController
);
CartRoutes.route("/cart/update-quantity").put(
  authUser,
  updateProductQuantityController
);

CartRoutes.route("/cart/get").get(authUser, getAllCartProducts);

export default CartRoutes;
