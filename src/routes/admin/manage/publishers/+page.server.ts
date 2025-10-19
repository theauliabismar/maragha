import { db } from '$lib/server/db';
import { publishers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const allPublishers = await db.select().from(publishers);
	return {
		publishers: allPublishers,
		title: 'Manage Publishers'
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

		await db.insert(publishers).values({
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
			.update(publishers)
			.set({ name: name as string })
			.where(eq(publishers.id, Number(id)));

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

		await db.delete(publishers).where(eq(publishers.id, Number(id)));

		return {
			success: true
		};
	}
};
