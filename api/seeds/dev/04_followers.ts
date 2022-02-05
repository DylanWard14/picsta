import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("followers").del();

  // Is this the best way to create related data?
  const users = await knex("users").select();

  // Inserts seed entries
  await knex("followers").insert([
    { leader_id: users[0].id, follower_id: users[1].id },
    { leader_id: users[0].id, follower_id: users[2].id },
    { leader_id: users[1].id, follower_id: users[0].id },
  ]);
}
