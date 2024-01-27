import mongoose from "mongoose";

export const DBConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
  } catch (err) {
    process.exit();
  }
};
