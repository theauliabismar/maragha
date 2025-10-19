import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { permissions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * @type {import('./$types').RequestHandler}
 * @description Get all permissions
 */
export async function GET() {
  const allPermissions = await db.select().from(permissions);
  return json(allPermissions);
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Create a new permission
 */
export async function POST(event) {
  const body = await event.request.json();
  const newPermission = await db.insert(permissions).values(body).returning();
  return json(newPermission[0]);
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Update a permission
 */
export async function PUT(event) {
  const body = await event.request.json();
  const updatedPermission = await db.update(permissions).set(body).where(eq(permissions.id, body.id)).returning();
  return json(updatedPermission[0]);
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Delete a permission
 */
export async function DELETE(event) {
  const body = await event.request.json();
  await db.delete(permissions).where(eq(permissions.id, body.id));
  return json({ success: true });
}
