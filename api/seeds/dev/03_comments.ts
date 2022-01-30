import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("comments").del();

  // Inserts seed entries
  await knex("comments").insert([
    { id: 1, contents: "Comment A", user_id: 1, post_id: 1 },
    { id: 2, contents: "Comment B", user_id: 2, post_id: 1 },
    { id: 3, contents: "Comment C", user_id: 3, post_id: 2 },
  ]);
}
