import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../models/user";
import { database } from "../../knexfile";
import { GenericQuery } from "../types";

type UsersRequest = Request<
  {},
  {},
  {},
  GenericQuery<User & { password: string }>
>;

const defaultSelect: Array<keyof User> = [
  "id",
  "created_at",
  "updated_at",
  "username",
  "bio",
  "avatar_url",
  "email",
];

const isUserKey = (key: string): key is keyof User => {
  return [
    "id",
    "created_at",
    "updated_at",
    "username",
    "bio",
    "avatar_url",
    "email",
  ].includes(key);
};

export const getUsers = async (req: UsersRequest, res: Response) => {
  try {
    const { limit, skip, select, ...where } = req.query;
    // Not sure if the best way to stop people from selecting/quering for the password
    delete where.password;

    const computedSelect: Array<keyof User> = select
      ? select.split(",").reduce<Array<keyof User>>((acc, item) => {
          if (isUserKey(item)) {
            return [...acc, item];
          }
          return acc;
        }, [])
      : defaultSelect;

    const users = await database<User>("users")
      .where(where)
      .select(computedSelect)
      .offset(skip ?? 0)
      .modify<{}, User[]>((builder) => {
        if (limit) {
          builder.limit(limit);
        }
        return builder;
      });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error });
  }
};

type UserRequest = Request<{ id: string }, {}, {}, { select?: string }>;

export const getUser = async (req: UserRequest, res: Response) => {
  try {
    const { select } = req.query;
    const computedSelect: Array<keyof User> = select
      ? select.split(",").reduce<Array<keyof User>>((acc, item) => {
          if (isUserKey(item)) {
            return [...acc, item];
          }
          return acc;
        }, [])
      : defaultSelect;

    const user = await database<User>("users")
      .where(req.params)
      .first(computedSelect);

    if (!user) {
      res.status(404).json({ error: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
};

type CreateUserRequest = Request<
  {},
  {},
  Pick<User, "username" | "email" | "bio" | "avatar_url"> & { password: string }
>;

export const createUser = async (req: CreateUserRequest, res: Response) => {
  try {
    const { body } = req;
    const saltRounds = 10;

    const emailUser = await database<User>("users")
      .where({ email: body.email })
      .first();

    if (emailUser) {
      return res.status(409).json({ error: "Email address already in use." });
    }

    const usernameUser = await database<User>("users")
      .where({ username: body.username })
      .first();

    if (usernameUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    await database<User & { password: string }>("users").insert({
      ...body,
      password: hashedPassword,
    });

    const user = await database<User>("users")
      .where({
        username: body.username,
        email: body.email,
      })
      .first(defaultSelect);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateUser = async (req: Request, res: Response) => {};

export const deleteUser = async (req: Request, res: Response) => {};
