import * as Redis from "ioredis";
// http://programminglife.io/ioredis.js-tutorial/

export const redis = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  family: 4, // 4(IPv4) or 6(IPv6)
  // password: "auth",
  db: 0
});
