import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const allCategories = await db.select().from(categories);
	return {
		categories: allCategories
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

		await db.insert(categories).values({
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
			.update(categories)
			.set({ name: name as string })
			.where(eq(categories.id, Number(id)));

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

		await db.delete(categories).where(eq(categories.id, Number(id)));

		return {
			success: true
		};
	}
};
