import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const email = data.get('email');
		const password = data.get('password');

		if (!name || !email || !password) {
			return {
				success: false
			};
		}

		const hashedPassword = await bcrypt.hash(password as string, 10);

		await db.insert(users).values({
			id: crypto.randomUUID(),
			name: name as string,
			email: email as string,
			password: hashedPassword
		});

		throw redirect(303, '/login');
	}
};
