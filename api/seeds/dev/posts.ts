import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("posts").del();

  // Inserts seed entries
  await knex("posts").insert([
    { photo_url: "URL A", user_id: 1, alt_text: "abc123" },
    { photo_url: "URL B", user_id: 2, alt_text: "abc123" },
    { photo_url: "URL C", user_id: 1, alt_text: "abc123" },
  ]);
}
