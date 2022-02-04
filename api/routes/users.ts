import express from "express";

import { User } from "../models/user";
import { database } from "../knexfile";

const userRouter = express.Router();

// TODO create controllers
userRouter.get("/", async (req, res) => {
  try {
    // TODO how to hide password
    const users = await database<User>("users").select();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export { userRouter };
