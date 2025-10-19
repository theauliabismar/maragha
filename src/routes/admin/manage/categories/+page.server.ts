import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const allCategories = await db.select().from(categories);
	return {
		categories: allCategories.map((cat) => ({
			id: cat.name,
			name: cat.name
		})),
		title: 'Manage Categories'
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
		const oldName = data.get('id');
		const newName = data.get('name');

		if (!oldName || !newName) {
			return {
				success: false
			};
		}

		await db
			.update(categories)
			.set({ name: newName as string })
			.where(eq(categories.name, oldName as string));

		return {
			success: true
		};
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('id');

		if (!name) {
			return {
				success: false
			};
		}

		await db.delete(categories).where(eq(categories.name, name as string));

		return {
			success: true
		};
	}
};