import express from "express";

import { getUsers, getUser } from "../controllers/users";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", getUser);

export { userRouter };
