import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
