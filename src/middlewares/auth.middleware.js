import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { API_ERRORS } from "../constants/constants.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      next(new ApiError(StatusCodes.UNAUTHORIZED, API_ERRORS.UNAUTHORIZED));

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user)
      next(new ApiError(StatusCodes.UNAUTHORIZED, API_ERRORS.INVALID_TOKEN));

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, API_ERRORS.INVALID_TOKEN));
  }
};
