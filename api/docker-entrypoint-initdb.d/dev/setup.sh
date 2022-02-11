#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "insta-dev";
    GRANT ALL PRIVILEGES ON DATABASE "insta-dev" TO postgres;
EOSQL