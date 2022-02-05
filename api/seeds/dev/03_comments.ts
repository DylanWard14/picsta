import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("comments").del();

  // Is this the best way to create related data?
  const users = await knex("users").select();
  const posts = await knex("posts").select();

  // Inserts seed entries
  await knex("comments").insert([
    {
      contents: "Comment A",
      user_id: users[0].id,
      post_id: posts[0].id,
    },
    {
      contents: "Comment B",
      user_id: users[1].id,
      post_id: posts[0].id,
    },
    {
      contents: "Comment C",
      user_id: users[2].id,
      post_id: posts[1].id,
    },
  ]);
}
