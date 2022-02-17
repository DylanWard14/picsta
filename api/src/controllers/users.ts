import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { database } from "../../knexfile";
import { GenericQuery } from "../types";
import { getUserById, getUserByValues } from "../utils";

const saltRounds = 10;

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

const computeUserSelect = (selectQuery?: string): Array<keyof User> => {
  if (typeof selectQuery === "undefined") {
    return defaultSelect;
  }

  const computedSelect = selectQuery
    .split(",")
    .reduce<Array<keyof User>>((acc, item) => {
      if (!isUserKey(item)) {
        return acc;
      }
      return [...acc, item];
    }, []);

  if (computedSelect.length > 0) {
    return computedSelect;
  }

  return defaultSelect;
};

export const getUsers = async (req: UsersRequest, res: Response) => {
  try {
    const { limit, skip, select, ...where } = req.query;
    // Not sure if the best way to stop people from selecting/quering for the password
    delete where.password;

    if (select?.includes("password")) {
      return res.status(400).json({
        error: {
          message: "Invalid selects",
        },
      });
    }

    const computedSelect = computeUserSelect(select);

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

type UserRequest = Request<{ id: number }, {}, {}, { select?: string }>;

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

    const user = await getUserById(req.params.id, computedSelect);

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
  Pick<User, "username" | "email" | "bio" | "avatar_url" | "password">
>;

export const createUser = async (req: CreateUserRequest, res: Response) => {
  try {
    // TODO probably need to create a method that will pick of the keys that we want
    // as currently you would be able to send through and id option
    const { body } = req;

    const emailUser = await getUserByValues(
      { email: body.email },
      defaultSelect
    );

    if (emailUser) {
      return res.status(409).json({ error: "Email address already in use." });
    }

    const usernameUser = await getUserByValues(
      { username: body.username },
      defaultSelect
    );

    if (usernameUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    await database<User & { password: string }>("users").insert({
      ...body,
      password: hashedPassword,
    });

    const user = await getUserByValues(
      { username: body.username, email: body.email },
      defaultSelect
    );

    // TODO we need to store this token in a tokens database so that we can invalidate specific tokens
    // when a user logsouts/changes a password, or wants to remove a specific device
    const token = await jwt.sign({ ...user }, process.env.JWT_SECRET ?? "", {
      expiresIn: 60 * 60,
    });

    res.status(201).json({ ...user, jwt: token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

type UpdateUserRequest = Request<
  {},
  {},
  Pick<User, "username" | "email" | "bio" | "avatar_url" | "password">
>;

type UserJWT = User & { exp: number };

// Returns true if this jwt is for a user
const isUserJWT = (jwt: string | jwt.JwtPayload): jwt is UserJWT => {
  if (typeof jwt === "string") {
    return false;
  }

  if (jwt.id && jwt.username && jwt.email) {
    return true;
  }

  return false;
};

export const updateUser = async (req: UpdateUserRequest, res: Response) => {
  try {
    const { headers, body } = req;
    const { authorization } = headers;

    if (!authorization) {
      return res
        .status(400)
        .json({ error: { message: "Please supply authorization header" } });
    }

    // Will throw error if verification fails
    const jwtUser = await jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET ?? ""
    );

    if (!isUserJWT(jwtUser)) {
      throw new Error("Invalid JWT");
    }

    // Ensure that user we are updating exists
    const user = await getUserById(jwtUser.id, defaultSelect);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const { password, ...restBody } = body;
    // Hashes the password if it is supplied
    const hashedPassword = password
      ? await bcrypt.hash(password, saltRounds)
      : undefined;

    await database<User & { password: string }>("users")
      .where({ id: jwtUser.id })
      .update({
        ...restBody,
        ...(hashedPassword ? { password: hashedPassword } : {}),
      });

    const updatedUser = await getUserByValues(
      { id: jwtUser.id },
      defaultSelect
    );

    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(401).json({ error });
  }
};

type DeleteUserRequest = Request<{ id: number }>;

export const deleteUser = async (req: DeleteUserRequest, res: Response) => {
  try {
    const { headers, params } = req;
    const { authorization } = headers;

    if (!authorization) {
      return res
        .status(400)
        .json({ error: { message: "Please supply authorization header" } });
    }

    // Will throw error if verification fails
    const jwtUser = await jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET ?? ""
    );

    if (!isUserJWT(jwtUser)) {
      throw new Error("Invalid JWT");
    }

    // User can only delete themselves
    if (jwtUser.id !== Number(params.id)) {
      return res.status(403).send();
    }

    const user = await getUserById(jwtUser.id, defaultSelect);

    if (!user) {
      return res.status(404).json({ error: "user does not exist" });
    }

    await database<User>("users").where({ id: params.id }).delete();

    return res.status(200).send("User deleted");
  } catch (error) {
    res.status(401).json({ error });
  }
};

type LoginUserRequest = Request<{}, {}, Pick<User, "email" | "password">>;

export const loginUser = async (req: LoginUserRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByValues({ email }, [
      ...defaultSelect,
      "password",
    ]);

    if (!user) {
      return res.status(401).json({ error: "invalid email or password" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ error: "invalid email or password" });
    }

    // TODO we need to store this token in a tokens database so that we can invalidate specific tokens
    // when a user logsouts/changes a password, or wants to remove a specific device
    const token = await jwt.sign({ ...user }, process.env.JWT_SECRET ?? "", {
      expiresIn: 60 * 60,
    });

    return res.status(200).json({ ...user, password: undefined, jwt: token });
  } catch (error) {
    res.status(401).json({ error });
  }
};
