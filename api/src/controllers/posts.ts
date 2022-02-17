import { Request, Response } from "express";

import { Post } from "../models/post";
import { database } from "../../knexfile";
import { GenericQuery } from "../types";
import { getPostById } from "../utils";

type PostsRequest = Request<{}, {}, {}, GenericQuery<Post>>;

const isPostKey = (key: string): key is keyof Post => {
  return [
    "id",
    "created_at",
    "updated_at",
    "photo_url",
    "user_id",
    "caption",
    "altText",
  ].includes(key);
};

// TODO consider turning into generic function to use accross controls
// TODO consider throwing error when invalid value appears in selectQuery
const computePostSelect = (selectQuery?: string): Array<keyof Post> => {
  if (typeof selectQuery === "undefined") {
    return [];
  }

  const computedSelect = selectQuery
    .split(",")
    .reduce<Array<keyof Post>>((acc, item) => {
      if (!isPostKey(item)) {
        return acc;
      }
      return [...acc, item];
    }, []);

  return computedSelect;
};

export const getPosts = async (req: PostsRequest, res: Response) => {
  try {
    const { limit, skip = 0, select, ...where } = req.query;

    const computedSelect = computePostSelect(select);

    const posts = await database<Post>("posts")
      .where(where)
      .select(computedSelect)
      .offset(skip)
      .modify<{}, Post[]>((builder) => {
        if (limit) {
          builder.limit(limit);
        }
        return builder;
      });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

type PostRequest = Request<{ id: number }, {}, {}, { select?: string }>;

export const getPost = async (req: PostRequest, res: Response) => {
  try {
    const { select } = req.query;

    const computedSelect = computePostSelect(select);

    const post = await getPostById(req.params.id, computedSelect);

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const createPost = async (req: Request, res: Response) => {
  return res.status(418).send();
};

export const updatePost = async (req: Request, res: Response) => {
  return res.status(418).send();
};

export const deletePost = async (req: Request, res: Response) => {
  return res.status(418).send();
};
