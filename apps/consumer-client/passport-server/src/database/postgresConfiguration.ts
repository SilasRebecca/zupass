import { ClientConfig } from "pg";

export interface DBConfiguration extends ClientConfig {
  user: string;
  password: string;
  host: string;
  database: string;
  port: number;
}

export function getDatabaseConfiguration(): DBConfiguration {
  if (process.env.DATABASE_USERNAME === undefined) {
    throw new Error("Missing environment variable: DATABASE_USERNAME");
  }

  if (process.env.DATABASE_PASSWORD === undefined) {
    throw new Error("Missing environment variable: DATABASE_PASSWORD");
  }

  if (process.env.DATABASE_HOST === undefined) {
    throw new Error("Missing environment variable: DATABASE_HOST");
  }

  if (process.env.DATABASE_DB_NAME === undefined) {
    throw new Error("Missing environment variable: DATABASE_DB_NAME");
  }

  return {
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DB_NAME,
    port: 5432,
    ssl: true,
    connectionTimeoutMillis: 0,
  };
}