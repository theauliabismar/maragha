import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server/db';
import Credentials from '@auth/core/providers/credentials';
import { users, accounts, sessions, verificationTokens, userRoles, permissions } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
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
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id) {
        const userRoleRelations = await db.select().from(userRoles).where(eq(userRoles.userId, user.id));
        const roleIds = userRoleRelations.map(ur => ur.roleId).filter((id): id is string => id !== null);
        if (roleIds.length > 0) {
          const userPermissions = await db.select().from(permissions).where(inArray(permissions.roleId, roleIds));
          token.permissions = userPermissions.reduce((acc: Record<string, { canCreate: boolean, canRead: boolean, canUpdate: boolean, canDelete: boolean }>, p) => {
            if (p.tableName) {
              acc[p.tableName] = {
                canCreate: acc[p.tableName]?.canCreate || p.canCreate,
                canRead: acc[p.tableName]?.canRead || p.canRead,
                canUpdate: acc[p.tableName]?.canUpdate || p.canUpdate,
                canDelete: acc[p.tableName]?.canDelete || p.canDelete,
              };
            }
            return acc;
          }, {});
        }
      }
      return token;
    },
    async session({ session, token }) {
      const userWithPermissions = session.user as { permissions?: Record<string, { canCreate: boolean, canRead: boolean, canUpdate: boolean, canDelete: boolean }> };
      if (userWithPermissions) {
        userWithPermissions.permissions = token.permissions as Record<string, { canCreate: boolean, canRead: boolean, canUpdate: boolean, canDelete: boolean }>;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the user is redirected to a callback URL on the same origin, use it
      if (url.startsWith(baseUrl)) return url;
      // Otherwise redirect to admin manage authors page
      return `${baseUrl}/admin/manage/authors`;
    }
  },
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
  secret: process.env.AUTH_SECRET ?? 'changeme-please-set-ENV-AUTH_SECRET',
  trustHost: true
});