import express from "express";
import {
  createProductController,
  getProductsController,
} from "../controllers/product.controller.js";

const ProductRoutes = express.Router();

ProductRoutes.route("/products").post(createProductController);
ProductRoutes.route("/products").get(getProductsController);

export default ProductRoutes;
