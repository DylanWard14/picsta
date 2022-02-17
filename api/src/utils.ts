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
