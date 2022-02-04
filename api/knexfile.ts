import { Knex, knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      database: "insta-dev",
      user: "postgres",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds/dev",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "insta-staging",
      user: "postgres",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "insta-prod",
      user: "postgres",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

const environment = process.env.NODE_ENV || "development";
export const database = knex(config[environment]);

export default config;
