import express from "express";
import {
  createProductController,
  getProductsController,
  getProductByIdController,
} from "../controllers/product.controller.js";

const ProductRoutes = express.Router();

ProductRoutes.route("/products").post(createProductController);
ProductRoutes.route("/products").get(getProductsController);
ProductRoutes.route("/products/:productId").get(getProductByIdController);

export default ProductRoutes;
