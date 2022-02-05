import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    { username: "test A", email: "testA@test.com", password: "abc123" },
    { username: "test B", email: "testB@test.com", password: "efg456" },
    { username: "test C", email: "testC@test.com", password: "hij789" },
  ]);
}
