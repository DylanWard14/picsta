import express from "express";

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", getUser);

userRouter.post("/", createUser);

userRouter.patch("/", updateUser);

userRouter.delete("/:id", deleteUser);

export { userRouter };
