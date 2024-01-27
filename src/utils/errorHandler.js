import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError.js";
import { API_ERRORS } from "../constants/constants.js";

export const errorHandler = async (err, req, res, next) => {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err);
  } else {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          API_ERRORS.INTERNAL_SERVER_ERROR
        )
      );
  }
};
