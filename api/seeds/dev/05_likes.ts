import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("likes").del();

  // Is this the best way to create related data?
  const users = await knex("users").select();
  const posts = await knex("posts").select();
  const comments = await knex("comments").select();

  // Inserts seed entries
  await knex("likes").insert([
    // User 1 likes post 2
    { user_id: users[0].id, post_id: posts[1].id },
    // User 2 likes comment 1
    { user_id: users[1].id, comment_id: comments[0].id },
    // User 3 likes post 1
    { user_id: users[2].id, post_id: posts[0].id },
  ]);
}
