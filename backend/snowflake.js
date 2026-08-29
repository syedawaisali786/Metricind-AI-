import dotenv from "dotenv";
import snowflake from "snowflake-sdk";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env
dotenv.config({
  path: path.join(__dirname, ".env"),
});

// ============================================================
// ENV CHECK
// ============================================================

console.log("ENV CHECK:", {
  account: !!process.env.SNOWFLAKE_ACCOUNT,
  username: !!process.env.SNOWFLAKE_USERNAME,
  warehouse: !!process.env.SNOWFLAKE_WAREHOUSE,
  database: !!process.env.SNOWFLAKE_DATABASE,
  schema: !!process.env.SNOWFLAKE_SCHEMA,
});

console.log("Account:", process.env.SNOWFLAKE_ACCOUNT);
console.log("Username:", process.env.SNOWFLAKE_USERNAME);
console.log("Warehouse:", process.env.SNOWFLAKE_WAREHOUSE);
console.log("Database:", process.env.SNOWFLAKE_DATABASE);
console.log("Schema:", process.env.SNOWFLAKE_SCHEMA);

// ============================================================
// SNOWFLAKE CONNECTION - JWT AUTHENTICATION
// ============================================================

const privateKeyPath = path.join(
  __dirname,
  "rsa_key.p8"
);

console.log(
  "Private key:",
  privateKeyPath
);

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,

  // RSA / JWT authentication
  authenticator: "SNOWFLAKE_JWT",
  privateKeyPath: privateKeyPath,

  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
});

// ============================================================
// CONNECT TO SNOWFLAKE
// ============================================================

export function connectSnowflake() {
  return new Promise((resolve, reject) => {
    connection.connect((err, conn) => {
      if (err) {
        console.error("❌ Snowflake connection failed:");
        console.error(err.message);
        reject(err);
        return;
      }

      console.log("=================================");
      console.log("✅ Connected to Snowflake");
      console.log("Connection ID:", conn.getId());
      console.log("Authentication: SNOWFLAKE_JWT");
      console.log("=================================");

      resolve(conn);
    });
  });
}

// ============================================================
// GET CONNECTION
// ============================================================

export function getConnection() {
  return connection;
}