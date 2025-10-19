import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server/db';
import Credentials from '@auth/core/providers/credentials';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: DrizzleAdapter(db),
	providers: [
		Credentials({
			credentials: {
				email: {},
				password: {}
			},
			async authorize(credentials) {
				if (!credentials.email || !credentials.password) {
					return null;
				}

				const user = await db
					.select()
					.from(users)
					.where(eq(users.email, credentials.email as string));

				if (user.length === 0) {
					return null;
				}

				const passwordMatch = await bcrypt.compare(
					credentials.password as string,
					user[0].password as string
				);

				if (passwordMatch) {
					return user[0];
				} else {
					return null;
				}
			}
		})
	]
});
