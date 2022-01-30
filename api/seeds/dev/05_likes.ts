import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("likes").del();

  // Inserts seed entries
  await knex("likes").insert([
    // User 1 likes post 2
    { id: 1, user_id: 1, post_id: 2 },
    // User 2 likes comment 1
    { id: 2, user_id: 2, comment_id: 1 },
    // User 3 likes post 1
    { id: 3, user_id: 3, post_id: 1 },
  ]);
}
