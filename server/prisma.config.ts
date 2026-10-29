import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Tells the Prisma CLI where the schema lives, where to save
// migrations and how to connect to the database
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});