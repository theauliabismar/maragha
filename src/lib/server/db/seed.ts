import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, authors, categories, publishers, roles, userRoles, permissions } from './schema';
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

	const hashedTestPassword = await bcrypt.hash('password', 10);
	await db.insert(users).values({
		id: '2',
		email: 'test@example.com',
		password: hashedTestPassword,
		name: 'Test User'
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

	const superadminRole = await db.insert(roles).values({
		id: 'superadmin',
		name: 'Super Admin'
	}).returning();

	await db.insert(userRoles).values({
		userId: '1',
		roleId: superadminRole[0].id
	});

	const tables = ['users', 'roles', 'permissions', 'publishers', 'books', 'pages', 'authors', 'categories'];
	for (const table of tables) {
		await db.insert(permissions).values({
			id: `${superadminRole[0].id}-${table}`,
			roleId: superadminRole[0].id,
			tableName: table,
			canCreate: true,
			canRead: true,
			canUpdate: true,
			canDelete: true
		});
	}
}

seed().catch((e) => {
	console.error('Error seeding database:', e);
	process.exit(1);
}).finally(() => {
	betterSqlite.close();
});