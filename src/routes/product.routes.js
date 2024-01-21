import express from "express";
import { createProductController } from "../controllers/product.controller.js";

const ProductRoutes = express.Router();

ProductRoutes.route("/products").post(createProductController);

export default ProductRoutes;
