require("env");
require("database/models");
const db = require("database/db");
const { sync } = require("database/sync");

// 운영환경이 아니라면 에러 발생시킴. 개발환경에서만 진행한다.
const isDev = process.env.NODE_ENV !== "production";
if (!isDev) {
  throw new Error("Sync script onlu works in the development environment");
}

async function excute() {
  try {
    await db.authenticate();
    sync();
    console.log("Sync successfully...");
    process.exit(0);
  } catch (err) {
    console.error("Unable to sync : error");
  }
}

excute();
