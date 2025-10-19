import { db } from '$lib/server/db';
import { books, pages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const bookId = Number(params.id);
	const book = await db.query.books.findFirst({
		where: eq(books.id, bookId)
	});
	const bookPages = await db.select().from(pages).where(eq(pages.bookId, bookId));

	return {
		book,
		pages: bookPages
	};
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const data = await request.formData();
		const originalText = data.get('originalText') as string;
		const translation = data.get('translation') as string;
		const status = data.get('status') as 'draft' | 'ulas' | 'setuju' | 'revisi';
		const bookId = Number(params.id);
		const pageNumber =
			(await db
				.select()
				.from(pages)
				.where(eq(pages.bookId, bookId))
				.then((res) => res.length)) + 1;

		await db.insert(pages).values({
			bookId,
			pageNumber,
			originalText,
			translation,
			status
		});

		return { success: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const originalText = data.get('originalText') as string;
		const translation = data.get('translation') as string;
		const status = data.get('status') as 'draft' | 'ulas' | 'setuju' | 'revisi';

		await db
			.update(pages)
			.set({
				originalText,
				translation,
				status
			})
			.where(eq(pages.id, id));

		return { success: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		await db.delete(pages).where(eq(pages.id, id));

		return { success: true };
	}
};