import express from "express";

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/users";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", getUser);

userRouter.post("/", createUser);

userRouter.patch("/", updateUser);

userRouter.delete("/:id", deleteUser);

userRouter.post("/login", loginUser);

export { userRouter };
