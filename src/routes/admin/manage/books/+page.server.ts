import { db } from '$lib/server/db';
import {
	authors,
	books,
	bookAuthors,
	bookCategories,
	categories,
	publishers
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const allBooks = await db.select().from(books);
	const allAuthors = await db.select().from(authors);
	const allCategories = await db.select().from(categories);
	const allPublishers = await db.select().from(publishers);
	const allBookAuthors = await db.select().from(bookAuthors);
	const allBookCategories = await db.select().from(bookCategories);
	return {
		books: allBooks.map((book) => {
			const authorLink = allBookAuthors.find((ba) => ba.bookId === book.id);
			const author = allAuthors.find((a) => a.id === authorLink?.authorId);
			const categoryLink = allBookCategories.find((bc) => bc.bookId === book.id);
			const category = allCategories.find((c) => c.id === categoryLink?.categoryId);
			return {
				...book,
				author: author?.name,
				category: category?.name
			};
		}),
		authors: allAuthors,
		categories: allCategories,
		publishers: allPublishers,
		bookAuthors: allBookAuthors,
		bookCategories: allBookCategories
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const edition = data.get('edition') as string;
		const status = data.get('status') as 'draft' | 'terbit' | 'batal';
		const authorId = Number(data.get('author'));
		const categoryId = Number(data.get('category'));
		const publisherId = Number(data.get('publisher'));

		// For simplicity, we're not handling createdBy and updatedBy yet
		const newBook = await db
			.insert(books)
			.values({
				title,
				edition,
				status,
				publisherId,
				createdAt: new Date(),
				updatedAt: new Date(),
				revision: 1, // Default revision to 1
			})
			.returning({ insertedId: books.id });

		const bookId = newBook[0].insertedId;

		await db.insert(bookAuthors).values({ bookId, authorId });
		await db.insert(bookCategories).values({ bookId, categoryId });

		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const title = data.get('title') as string;
		const edition = data.get('edition') as string;
		const status = data.get('status') as 'draft' | 'terbit' | 'batal';
		const authorId = Number(data.get('author'));
		const categoryId = Number(data.get('category'));
		const publisherId = Number(data.get('publisher'));

		await db
			.update(books)
			.set({
				title,
				edition,
				status,
				publisherId,
				updatedAt: new Date()
			})
			.where(eq(books.id, id));

		await db.delete(bookAuthors).where(eq(bookAuthors.bookId, id));
		await db.delete(bookCategories).where(eq(bookCategories.bookId, id));
		await db.insert(bookAuthors).values({ bookId: id, authorId });
		await db.insert(bookCategories).values({ bookId: id, categoryId });

		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		await db.delete(bookAuthors).where(eq(bookAuthors.bookId, id));
		await db.delete(bookCategories).where(eq(bookCategories.bookId, id));
		await db.delete(books).where(eq(books.id, id));

		return { success: true };
	}
};