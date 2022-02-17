import jwt from "jsonwebtoken";

import { User } from "./models/user";
import { Post } from "./models/post";
import { database } from "../knexfile";

export const getUserById = async (id: number, select: Array<keyof User>) => {
  return await database<User>("users").where({ id }).first(select);
};

export const getUserByValues = async (
  params: Partial<User>,
  select: Array<keyof User>
) => {
  return await database<User>("users").where(params).first(select);
};

export const getPostById = async (id: number, select: Array<keyof Post>) => {
  return await database<Post>("posts").where({ id }).first(select);
};

type UserJWT = User & { exp: number };

/**
 *  Returns true if this jwt is for a user
 */
export const isUserJWT = (jwt: string | jwt.JwtPayload): jwt is UserJWT => {
  if (typeof jwt === "string") {
    return false;
  }

  if (jwt.id && jwt.username && jwt.email) {
    return true;
  }

  return false;
};
