import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * @type {import('./$types').RequestHandler}
 * @description Get all users
 */
export async function GET() {
  const allUsers = await db.select().from(users);
  return json(allUsers);
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Create a new user
 */
export async function POST(event) {
  const body = await event.request.json();
  const newUser = await db.insert(users).values(body).returning();
  return json(newUser[0]);
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Update a user
 */
export async function PUT(event) {
  const body = await event.request.json();
  const updatedUser = await db.update(users).set(body).where(eq(users.id, body.id)).returning();
  return json(updatedUser[0]);
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Delete a user
 */
export async function DELETE(event) {
  const body = await event.request.json();
  await db.delete(users).where(eq(users.id, body.id));
  return json({ success: true });
}
