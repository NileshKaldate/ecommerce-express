import express from "express";
import { config } from "dotenv";
import { DBConnect } from "./config/DBConnect.config.js";
import ProductRoutes from "./routes/product.routes.js";
import UserRoutes from "./routes/user.routes.js";
import CartRoutes from "./routes/cart.routes.js";
import { errorHandler } from "./utils/errorHandler.js";
import ApiError from "./utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { API_ERRORS } from "./constants/constants.js";

config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json(), (err, req, res, next) => {
  if (err)
    throw new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.PROPER_JSON_DATA);
});

app.head("/health", (req, res) => {
  return res.status(StatusCodes.OK).end();
});

app.use(ProductRoutes);
app.use(UserRoutes);
app.use(CartRoutes);

app.use("*", () => {
  throw new ApiError(StatusCodes.NOT_FOUND, API_ERRORS.ROUTE_NOT_FOUND);
});

app.use(errorHandler);

DBConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch(() => {
    console.error("Error while connecting to the database");
  });
