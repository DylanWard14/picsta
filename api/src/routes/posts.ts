import express from "express";

import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts";

const postRouter = express.Router();

postRouter.get("/", getPosts);

postRouter.get("/:id", getPost);

postRouter.post("/", createPost);

postRouter.patch("/", updatePost);

postRouter.delete("/:id", deletePost);

export { postRouter };
