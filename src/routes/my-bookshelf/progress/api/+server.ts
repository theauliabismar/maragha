import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userBookshelf } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function PUT(event) {
  const session = await event.locals.auth();
  if (!session?.user?.id) {
    return json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await event.request.json();
  const { bookId, progress } = body;

  if (!bookId || progress === undefined) {
    return json({ success: false, error: 'Missing bookId or progress' }, { status: 400 });
  }

  await db.update(userBookshelf).set({ progress }).where(and(eq(userBookshelf.userId, session.user.id), eq(userBookshelf.bookId, bookId)));
  return json({ success: true });
}
