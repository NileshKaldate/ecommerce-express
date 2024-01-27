import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { API_ERRORS, API_RESPONSE } from "../constants/constants.js";
import Cart from "../models/cart.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const addToCartController = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const { user } = req;

  if (!productId)
    throw new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.PRODUCT_ID_REQUIRED);

  let cart = await Cart.findOne({ user: user._id });

  if (!cart) {
    cart = new Cart({ user: user._id, products: [] });
  }

  let existingProduct = cart.products?.find(
    (item) => item.product.toString() === productId
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ product: productId, quantity });
  }

  await cart.save();

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, cart, API_RESPONSE.ADDED_TO_CART));
});

const removeFromCartController = asyncHandler(async (req, res) => {
  const { user } = req;
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, API_ERRORS.PRODUCT_ID_REQ);
  }

  let cart = await Cart.findOne({ user: user._id });

  if (!cart || cart.products.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.CART_IS_EMPTY);
  }

  if (!cart.products.some((item) => item.product.toString() === productId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.PRODUCT_NOT_IN_CART);
  }

  const products = cart.products.filter(
    (item) => item.product.toString() !== productId
  );
  cart.products = products;

  await cart.save();

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        {},
        API_RESPONSE.PRODUCT_REMOVED_FROM_CART
      )
    );
});

const updateProductQuantityController = asyncHandler(async (req, res) => {
  const { user } = req;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(StatusCodes.OK, API_ERRORS.ALL_FIELDS_REQUIRED);
  }

  const cart = await Cart.findOne({ user: user._id });

  const product = cart.products.find(
    (item) => item.product.toString() === productId
  );

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, API_ERRORS.PRODUCT_NOT_IN_CART);
  }

  product.quantity = quantity;

  cart.save();

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        product,
        API_RESPONSE.PRODUCT_QUANTITY_CHANGES
      )
    );
});

const getAllCartProducts = asyncHandler(async (req, res) => {
  const { user } = req;

  const cart = await Cart.findOne({ user: user._id }).populate({
    path: "products.product",
    model: "Products",
  });

  return res
    .status(cart.products.length !== 0 ? StatusCodes.OK : StatusCodes.NOT_FOUND)
    .json(
      new ApiResponse(
        cart.products.length !== 0 ? StatusCodes.OK : StatusCodes.NOT_FOUND,
        cart.products,
        cart.products.length !== 0
          ? API_RESPONSE.PRODUCTS_FOUND
          : API_RESPONSE.CART_IS_EMPTY
      )
    );
});

export {
  addToCartController,
  removeFromCartController,
  updateProductQuantityController,
  getAllCartProducts,
};
