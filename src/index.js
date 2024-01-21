import express from "express";
import { config } from "dotenv";
import { DBConnect } from "./config/dataBase.config.js";
import ProductRoutes from "./routes/product.routes.js";

config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(ProductRoutes);

DBConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch(() => {
    console.error("Error while connecting to the database");
  });
