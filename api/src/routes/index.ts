import express from "express";
import { userRouter } from "./users";
import { postRouter } from "./posts";

const rootRouter = express.Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/posts", postRouter);

export { rootRouter };
