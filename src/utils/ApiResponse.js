import { StatusCodes } from "http-status-codes";

export default function ApiResponse(
  statusCode,
  data,
  message,
  count,
  hasNextPage
) {
  this.status = statusCode;
  this.data = data;
  this.message = message;
  this.success = statusCode < StatusCodes.BAD_REQUEST;
  this.count = count;
  this.hasNextPage = hasNextPage;
}
