import { db } from '$lib/server/db';
import {
	authors,
	books,
	bookAuthors,
	bookCategories,
	categories,
	publishers
} from '$lib/server/db/schema';
import { eq, max } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	const user = session?.user as { 
		permissions?: Record<string, { 
			canCreate: boolean; 
			canRead: boolean; 
			canUpdate: boolean; 
			canDelete: boolean;
		}> 
	};
	const permissions = user?.permissions?.books ?? { 
		canCreate: false, 
		canRead: false, 
		canUpdate: false, 
		canDelete: false 
	};

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
			const category = allCategories.find((c) => c.name === categoryLink?.categoryId);
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
		bookCategories: allBookCategories,
		permissions: {
			canCreate: permissions.canCreate ?? false,
			canUpdate: permissions.canUpdate ?? false,
			canDelete: permissions.canDelete ?? false
		}
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const edition = data.get('edition') as string;
		const status = (data.get('status') as 'draft' | 'terbit' | 'batal') || 'draft';
		
		// Parse authors and categories from JSON strings
		const authorsString = data.get('authors') as string;
		const authorIds = authorsString ? JSON.parse(authorsString) : [];
		
		const categoriesString = data.get('categories') as string;
		const categoryNames = categoriesString ? JSON.parse(categoriesString) : [];
		
		// Parse publisher
		const publisherString = data.get('publisher') as string;
		const publisherId = publisherString ? Number(publisherString) : null;

		if (!title) {
			return {
				success: false,
				error: 'Title is required'
			};
		}

		// Get the next book ID
		const result = await db.select({ value: max(books.id) }).from(books);
		const maxId = result[0].value ?? 0;
		const nextId = maxId + 1;

		// Insert book with generated ID
		await db.insert(books).values({
			id: nextId,
			title,
			edition: edition || '1',
			status,
			publisherId: publisherId as number | null,
			createdAt: new Date(),
			updatedAt: new Date(),
			revision: 1,
		});

		// Insert all selected authors
		for (const authorId of authorIds) {
			await db.insert(bookAuthors).values({ bookId: nextId, authorId });
		}
		
		// Insert all selected categories
		for (const categoryName of categoryNames) {
			await db.insert(bookCategories).values({ bookId: nextId, categoryId: categoryName });
		}

		return { success: true };
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const title = data.get('title') as string;
		const edition = data.get('edition') as string;
		const status = (data.get('status') as 'draft' | 'terbit' | 'batal') || 'draft';
		
		// Parse authors and categories from JSON strings
		const authorsString = data.get('authors') as string;
		const authorIds = authorsString ? JSON.parse(authorsString) : [];
		
		const categoriesString = data.get('categories') as string;
		const categoryNames = categoriesString ? JSON.parse(categoriesString) : [];
		
		// Parse publisher
		const publisherString = data.get('publisher') as string;
		const publisherId = publisherString ? Number(publisherString) : null;

		await db
			.update(books)
			.set({
				title,
				edition: edition || '1',
				status,
				publisherId: publisherId as number | null,
				updatedAt: new Date()
			})
			.where(eq(books.id, id));

		// Delete existing relationships
		await db.delete(bookAuthors).where(eq(bookAuthors.bookId, id));
		await db.delete(bookCategories).where(eq(bookCategories.bookId, id));
		
		// Insert all selected authors
		for (const authorId of authorIds) {
			await db.insert(bookAuthors).values({ bookId: id, authorId });
		}
		
		// Insert all selected categories
		for (const categoryName of categoryNames) {
			await db.insert(bookCategories).values({ bookId: id, categoryId: categoryName });
		}

		return { success: true };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		// Delete relationships first
		await db.delete(bookAuthors).where(eq(bookAuthors.bookId, id));
		await db.delete(bookCategories).where(eq(bookCategories.bookId, id));
		
		// Delete the book
		await db.delete(books).where(eq(books.id, id));

		return { success: true };
	}
};