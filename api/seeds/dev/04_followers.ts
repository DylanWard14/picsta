import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("followers").del();

  // Inserts seed entries
  await knex("followers").insert([
    { id: 1, leader_id: 1, follower_id: 2 },
    { id: 2, leader_id: 1, follower_id: 3 },
    { id: 3, leader_id: 2, follower_id: 1 },
  ]);
}
