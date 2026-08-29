import dotenv from "dotenv";
import snowflake from "snowflake-sdk";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,

  authenticator: "SNOWFLAKE_JWT",
  privateKeyPath: path.join(__dirname, "rsa_key.p8"),

  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
});

connection.connect((err, conn) => {
  if (err) {
    console.error("❌ SNOWFLAKE LOGIN FAILED");
    console.error(err.message);
    process.exit(1);
  }

  console.log("✅ SNOWFLAKE CONNECTED");

  const sql = `
    SELECT
      ID,
      DATE,
      COUNTRY,
      REGION,
      PRODUCT,
      ORDERS,
      REVENUE,
      COST,
      SHIPPING_COST,
      MATERIAL_COST
    FROM METRICMIND.ANALYTICS.BUSINESS_DATA
    ORDER BY DATE
    LIMIT 10
  `;

  conn.execute({
    sqlText: sql,

    complete: (err, stmt, rows) => {
      if (err) {
        console.error("❌ QUERY FAILED");
        console.error(err.message);
        return;
      }

      console.log("================================");
      console.log("✅ SNOWFLAKE DATA QUERY SUCCESS");
      console.log("================================");

      console.table(rows);

      conn.destroy((destroyErr) => {
        if (destroyErr) {
          console.error("Connection close error:", destroyErr.message);
        } else {
          console.log("✅ Connection closed");
        }
      });
    },
  });
});