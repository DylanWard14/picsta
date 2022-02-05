import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("posts").del();

  // Is this the best way to create related data?
  const users = await knex("users").select();

  // Inserts seed entries
  await knex("posts").insert([
    { photo_url: "URL A", user_id: users[0].id, alt_text: "abc123" },
    { photo_url: "URL B", user_id: users[2].id, alt_text: "abc123" },
    { photo_url: "URL C", user_id: users[1].id, alt_text: "abc123" },
  ]);
}
