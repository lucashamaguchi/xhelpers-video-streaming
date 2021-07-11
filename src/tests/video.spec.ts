import * as ChaiAsPromised from "chai-as-promised";
import { db } from "xhelpers-api/lib/db-sequelize";
import * as nock from "nock";
import { expect, use } from "chai";

import { v4 as uuidv4 } from "uuid";
import * as jwt from "jsonwebtoken";
import { getServer } from "../index";

let server = null;

function getJwtToken(user: any) {
	const options = {
		issuer: process.env.JWT_ISSUER,
		expiresIn: process.env.JWT_EXPIRE,
	};
	return jwt.sign(
		{
			user,
		},
		process.env.JWT_SECRET || "",
		options
	);
}

const user = {
	id: uuidv4(),
};

use(ChaiAsPromised);

describe("Testing Videos API", () => {
	before(async () => {
		server = await getServer();
		server.start();
	});
	after(async () => {
		if (server) await server.stop().then(() => console.info("Server Stoped"));
	});

	beforeEach(async () => {
		await db.sequelize.sync();
	});
	afterEach(async () => {
		if (process.env.SEQ_SQLDB_HOST === "db") await db.sequelize.drop();
	});

	describe("Videos API", async () => {
		it("Docs Health", async () => {
			const response = await server.inject("/documentation");
			expect(response.statusCode).to.equal(200);
		});
	});
});
