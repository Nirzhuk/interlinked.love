import path from "node:path";
import dotenv from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db } from "./drizzle";

dotenv.config();

async function main() {
	await migrate(db, {
		migrationsFolder: path.join(process.cwd(), "/src/lib/db/migrations"),
	});
	console.info("Migrations complete");
	await client.end();
	return true;
}

main();
