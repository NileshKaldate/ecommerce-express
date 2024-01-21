import { API_ERRORS, API_RESPONSE } from "../constants/constants.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";
import Products from "../models/product.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const createProductController = asyncHandler(async (req, res) => {
  const { title, price, description, category, image } = req.body;
  if (!title || !price || !description || !category || !image) {
    throw new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.ALL_FIELDS_REQUIRED);
  }
  const data = {
    title,
    price,
    description,
    category,
    image,
  };
  const createdProduct = await Products.create(data);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        createdProduct,
        API_RESPONSE.PRODUCT_CREATED
      )
    );
});

export { createProductController };
