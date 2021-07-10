require("dotenv").config();

import { createServer } from "xhelpers-api/lib/server";
const pkgJson = require("../package.json");

const options: any = {
  serverOptions: {
    port: process.env.PORT || 3100,
    host: process.env.HOST || "127.0.0.1",
  },
  options: {
    swaggerOptions: {
      info: {
        title: pkgJson.name,
        version: pkgJson.version,
      },
      schemes: [process.env.SSL === "true" ? "https" : "http"],
      grouping: "tags",
    },
    routeOptions: {
      routes: "*/routes/*.route.js",
    },
  },
};

export async function getServer(){
  let server: any = {};
  server = await createServer(options);
  return server;
}

async function start() {
  let server = await getServer();
  await server.start();
  return server;
}

if (typeof require !== 'undefined' && require.main === module) {
  start();
}
