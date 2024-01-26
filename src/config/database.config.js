import mongoose from "mongoose";
import Products from "../models/product.model.js";

export const DBConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log(mongoose.connection.host);
  } catch (err) {
    console.log("DB connection error: ", err);
    process.exit();
  }
};
