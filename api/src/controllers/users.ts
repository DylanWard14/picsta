import { Request, Response } from "express";

import { User } from "../models/user";
import { database } from "../../knexfile";
import { GenericQuery } from "../types";

type UserRequest = Request<
  {},
  {},
  {},
  GenericQuery<User & { password: string }>
>;

const defaultSelect = [
  "id",
  "created_at",
  "updated_at",
  "username",
  "bio",
  "avatar_url",
];

export const getUsers = async (req: UserRequest, res: Response) => {
  try {
    const { limit, skip, select, ...where } = req.query;
    // Not sure if the best way to stop people from selecting/quering for the password
    delete where.password;

    const computedSelect = select
      ? select.split(",").filter((value) => value !== "password")
      : defaultSelect;

    const users = await database<User>("users")
      .where(where)
      .select(computedSelect)
      .offset(skip ?? 0)
      .modify((builder) => {
        if (limit) {
          builder.limit(limit);
        }
      });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error });
  }
};
