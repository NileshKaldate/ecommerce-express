import express from "express";
import {
  registerUserController,
  loginUserController,
} from "../controllers/user.controller.js";

const UserRoutes = express.Router();

UserRoutes.route("/register").post(registerUserController);
UserRoutes.route("/login").post(loginUserController);

export default UserRoutes;
