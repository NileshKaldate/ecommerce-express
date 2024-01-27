import { StatusCodes } from "http-status-codes";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { API_ERRORS, API_RESPONSE } from "../constants/constants.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUserController = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .state(StatusCodes.BAD_REQUEST)
      .json(
        new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.ALL_FIELDS_REQUIRED)
      );
  }

  const userExisted = await User.findOne({ $or: [{ email }] });

  if (userExisted) {
    throw new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.USER_EXIST);
  }

  const data = { fullName, email, password };

  const user = await User.create(data);

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      API_ERRORS.CREATING_USER
    );
  }

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, createdUser, API_RESPONSE.USER_CREATED)
    );
});

const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.ALL_FIELDS_REQUIRED);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.USER_NOT_EXIST);
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.PASSWORD_INCORRECT);
  }

  const token = await user.generateAccessToken();

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { token },
        API_RESPONSE.LOGGED_SUCCESSFULLY
      )
    );
});

export { registerUserController, loginUserController };
