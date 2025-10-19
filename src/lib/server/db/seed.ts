import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, authors, categories, publishers } from './schema';
import bcrypt from 'bcrypt';

const betterSqlite = new Database('./src/lib/server/db/local.db');
const db = drizzle(betterSqlite);

async function seed() {
	const hashedPassword = await bcrypt.hash('password', 10);
	await db.insert(users).values({
		id: '1',
		email: 'admin@example.com',
		password: hashedPassword,
		name: 'Admin User'
	});

	await db.insert(authors).values([
		{ name: 'Test Author' },
		{ name: 'Another Author' }
	]);

	await db.insert(categories).values([
		{ name: 'Test Category' },
		{ name: 'Another Category' }
	]);

	await db.insert(publishers).values([
		{ name: 'Test Publisher' },
		{ name: 'Another Publisher' }
	]);
}

seed().catch((e) => {
	console.error('Error seeding database:', e);
	process.exit(1);
}).finally(() => {
	betterSqlite.close();
});