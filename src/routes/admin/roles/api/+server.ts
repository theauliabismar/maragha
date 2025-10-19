import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { roles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * @type {import('./$types').RequestHandler}
 * @description Get all roles
 */
export async function GET() {
  const allRoles = await db.select().from(roles);
  return json(allRoles);
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Create a new role
 */
export async function POST(event) {
  const body = await event.request.json();
  const newRole = await db.insert(roles).values(body).returning();
  return json(newRole[0]);
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Update a role
 */
export async function PUT(event) {
  const body = await event.request.json();
  const updatedRole = await db.update(roles).set(body).where(eq(roles.id, body.id)).returning();
  return json(updatedRole[0]);
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Delete a role
 */
export async function DELETE(event) {
  const body = await event.request.json();
  await db.delete(roles).where(eq(roles.id, body.id));
  return json({ success: true });
}
