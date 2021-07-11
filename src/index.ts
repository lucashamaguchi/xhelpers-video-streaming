import { createServer, createServerOptions } from "xhelpers-api/lib/server";

require("dotenv").config();

const pkgJson = require("../package.json");

const options: createServerOptions = {
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
		mongooseOptions: {
			uri: process.env.MONGODB_URI,
			connectionOptions: {},
		},
	},
};

export async function getServer() {
	let server: any = {};
	server = await createServer(options);
	return server;
}

async function start() {
	const server = await getServer();
	await server.start();
	return server;
}

if (typeof require !== "undefined" && require.main === module) {
	start();
}
