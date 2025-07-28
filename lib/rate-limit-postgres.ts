import { RateLimiterPostgres } from "rate-limiter-flexible";
import { Pool } from "pg";

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const rateLimiter = new RateLimiterPostgres({
  storeClient: pgPool,
  tableName: "rate_limit",
  points: 10, // max requests
  duration: 60, // per 60 seconds
  blockDuration: 60, // block for 60s if over limit
  keyPrefix: "rlflx",
});

export default rateLimiter;
