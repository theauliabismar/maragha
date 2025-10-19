import { db } from '$lib/server/db';
import { authors } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const allAuthors = await db.select().from(authors);
	return {
		authors: allAuthors
	};
};

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');

		if (!name) {
			return {
				success: false
			};
		}

		await db.insert(authors).values({
			name: name as string
		});

		return {
			success: true
		};
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const name = data.get('name');

		if (!id || !name) {
			return {
				success: false
			};
		}

		await db
			.update(authors)
			.set({ name: name as string })
			.where(eq(authors.id, Number(id)));

		return {
			success: true
		};
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) {
			return {
				success: false
			};
		}

		await db.delete(authors).where(eq(authors.id, Number(id)));

		return {
			success: true
		};
	}
};
