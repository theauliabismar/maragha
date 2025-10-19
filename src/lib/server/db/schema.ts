import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import type { AdapterAccount } from '@auth/core/adapters';

export const users = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
	image: text('image'),
	password: text('password')
});

export const accounts = sqliteTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	})
);

export const sessions = sqliteTable('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
});

export const verificationTokens = sqliteTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
	})
);

export const roles = sqliteTable('jabatan', {
	id: text('id').primaryKey(),
	name: text('nama').notNull()
});

export const userRoles = sqliteTable(
	'pengguna_jabatan',
	{
		userId: text('pengguna_id').references(() => users.id),
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
		createdBy: text('dibuatOleh').references(() => users.id),
		updatedAt: integer('diubahPada', { mode: 'timestamp' }).notNull(),
		updatedBy: text('diubahOleh').references(() => users.id),
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
