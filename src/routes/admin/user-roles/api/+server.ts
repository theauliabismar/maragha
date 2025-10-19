import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userRoles } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

/**
 * @type {import('./$types').RequestHandler}
 * @description Assign a role to a user
 */
export async function POST(event) {
  const body = await event.request.json();
  const newUserRole = await db.insert(userRoles).values(body).returning();
  return json(newUserRole[0]);
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Unassign a role from a user
 */
export async function DELETE(event) {
  const body = await event.request.json();
  await db.delete(userRoles).where(and(eq(userRoles.userId, body.userId), eq(userRoles.roleId, body.roleId)));
  return json({ success: true });
}
