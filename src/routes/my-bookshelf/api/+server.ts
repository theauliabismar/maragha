import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userBookshelf } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

/**
 * @type {import('./$types').RequestHandler}
 * @description Add a book to the user's bookshelf
 */
export async function POST(event) {
  const session = await event.locals.auth();
  if (!session?.user?.id) {
    return json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await event.request.json();
  const { bookId } = body;

  if (!bookId) {
    return json({ success: false, error: 'Missing bookId' }, { status: 400 });
  }

  await db.insert(userBookshelf).values({ userId: session.user.id, bookId });
  return json({ success: true });
}

/**
 * @type {import('./$types').RequestHandler}
 * @description Remove a book from the user's bookshelf
 */
export async function DELETE(event) {
  const session = await event.locals.auth();
  if (!session?.user?.id) {
    return json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await event.request.json();
  const { bookId } = body;

  if (!bookId) {
    return json({ success: false, error: 'Missing bookId' }, { status: 400 });
  }

  await db.delete(userBookshelf).where(and(eq(userBookshelf.userId, session.user.id), eq(userBookshelf.bookId, bookId)));
  return json({ success: true });
}
