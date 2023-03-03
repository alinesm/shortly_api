import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  // ...(process.env.NODE_ENV === "production" && {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // }),
};

const connection = new Pool(configDatabase);

export default connection;
