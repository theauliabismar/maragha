import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const pengguna = sqliteTable('pengguna', {
	id: text('id').primaryKey(),
	username: text('username').notNull(),
	password_hash: text('password_hash').notNull()
});

export const roles = sqliteTable('jabatan', {
	id: text('id').primaryKey(),
	name: text('nama').notNull()
});

export const userRoles = sqliteTable(
	'pengguna_jabatan',
	{
		userId: text('pengguna_id').references(() => pengguna.id),
		roleId: text('jabatan_id').references(() => roles.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.roleId] })
	})
);

export const permissions = sqliteTable('hak', {
	id: text('id').primaryKey(),
	roleId: text('jabatan_id').references(() => roles.id),
	tableName: text('table_name').notNull(),
	canCreate: integer('can_create', { mode: 'boolean' }).notNull().default(false),
	canRead: integer('can_read', { mode: 'boolean' }).notNull().default(false),
	canUpdate: integer('can_update', { mode: 'boolean' }).notNull().default(false),
	canDelete: integer('can_delete', { mode: 'boolean' }).notNull().default(false)
});

export const publishers = sqliteTable('penerbit', {
	id: integer('id').primaryKey(),
	name: text('nama').notNull()
});

export const books = sqliteTable(
	'buku',
	{
		id: integer('id').notNull(),
		revision: integer('revisi').notNull(),
		title: text('judul').notNull(),
		edition: text('edisi'),
		status: text('status', { enum: ['draft', 'terbit', 'batal'] }).notNull().default('draft'),
		createdAt: integer('dibuatPada', { mode: 'timestamp' }).notNull(),
		createdBy: text('dibuatOleh').references(() => pengguna.id),
		updatedAt: integer('diubahPada', { mode: 'timestamp' }).notNull(),
		updatedBy: text('diubahOleh').references(() => pengguna.id),
		publisherId: integer('penerbit_id').references(() => publishers.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.id, t.revision] })
	})
);

export const pages = sqliteTable('halaman', {
	id: integer('id').primaryKey(),
	bookId: integer('buku_id').references(() => books.id),
	pageNumber: integer('pageNumber').notNull(),
	originalText: text('tulisan').notNull(),
	translation: text('terjemah'),
	comment: text('komentar'),
	screenshot: text('tangkapan'),
	status: text('status', { enum: ['draft', 'ulas', 'setuju', 'revisi'] })
		.notNull()
		.default('draft')
});

export const authors = sqliteTable('penulis', {
	id: integer('id').primaryKey(),
	name: text('nama').notNull()
});

export const bookAuthors = sqliteTable(
	'buku_penulis',
	{
		bookId: integer('buku_id').references(() => books.id),
		authorId: integer('penulis_id').references(() => authors.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.bookId, t.authorId] })
	})
);

export const categories = sqliteTable('kategori', {
	id: integer('id').primaryKey(),
	name: text('nama').notNull()
});

export const bookCategories = sqliteTable(
	'buku_kategori',
	{
		bookId: integer('buku_id').references(() => books.id),
		categoryId: integer('kategori_id').references(() => categories.id)
	},
	(t) => ({
		pk: primaryKey({ columns: [t.bookId, t.categoryId] })
	})
);
