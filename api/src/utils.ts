import { User } from "./models/user";
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
