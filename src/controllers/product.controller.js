import { StatusCodes } from "http-status-codes";
import { API_ERRORS, API_RESPONSE, INTEGERS } from "../constants/constants.js";
import Products from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

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

const getProductsController = asyncHandler(async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || INTEGERS.ONE;
  const pageSize = parseInt(req.query.pageSize) || INTEGERS.TWENTY_FOUR;
  const skip = pageNumber * pageSize - pageSize;
  const category = req.query.category ? { category: req.query.category } : {};
  const search = req.query.search
    ? {
        title: { $regex: req.query.search, $options: "i" },
      }
    : {};

  const products = await Products.find({ ...search, ...category })
    .skip(skip)
    .limit(pageSize);

  const count = await Products.countDocuments({ ...search, ...category });

  const hasNextPage = pageNumber * pageSize < count;

  return res
    .status(products.length > 0 ? StatusCodes.OK : StatusCodes.NOT_FOUND)
    .json(
      new ApiResponse(
        products.length > 0 ? StatusCodes.OK : StatusCodes.NOT_FOUND,
        products,
        products.length > 0
          ? API_RESPONSE.PRODUCTS_FOUND
          : API_RESPONSE.PRODUCTS_NOT_FOUND,
        count,
        hasNextPage
      )
    );
});

const getProductByIdController = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.PRODUCT_ID_REQ);
  }

  const product = await Products.findOne({ _id: productId });

  if (!product) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      API_ERRORS.PRODUCT_NOT_AVAILABLE
    );
  }

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, product, API_RESPONSE.PRODUCT_FOUND));
});

export {
  createProductController,
  getProductsController,
  getProductByIdController,
};
