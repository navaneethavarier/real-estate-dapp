import express from "express";
import jwt from "express-jwt";

import { config } from "../../config";
import * as controller from "../controllers/user";

export const userRouter = express.Router();
export const authRouter = express.Router();

/** POST /api/auth */
authRouter.route("/").post(controller.create);

//==========================================================================
/** GET /api/users */
userRouter.route("/").get(controller.find);

/** GET /api/users/:userId */
/** Authenticated route */
userRouter.route("/:userId").get(jwt(config), controller.get);

/** POST /api/users */
userRouter.route("/").post(controller.create);

/** PATCH /api/users/:userId */
/** Authenticated route */
userRouter.route("/:userId").patch(jwt(config), controller.patch);