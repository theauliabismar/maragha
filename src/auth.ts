import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server/db';
import Credentials from '@auth/core/providers/credentials';
import { users, accounts, sessions, verificationTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens
  }),
  session: {
    strategy: 'jwt'
  },
  // --- ADD THIS BLOCK ---
  // This tells Auth.js to use your custom login page
  // for sign-in and for displaying errors.
  pages: {
    signIn: '/login'
  },
  // ----------------------
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          console.error('Auth Error: Missing email or password');
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (user.length === 0) {
          console.error('Auth Error: User not found with email:', credentials.email);
          return null;
        }

        const foundUser = user[0];

        if (!foundUser.password) {
          console.error('Auth Error: User found, but has no password set.');
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          foundUser.password
        );

        if (passwordMatch) {
          return foundUser;
        } else {
          console.error('Auth Error: Invalid password');
          return null;
        }
      }
    })
  ],
  secret: process.env.AUTH_SECRET ?? 'changeme-please-set-ENV-AUTH_SECRET'
});