import { db } from '$lib/server/db';
import { books, pages, userBookshelf } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
  const session = await locals.auth();
  const bookId = Number(params.id);

  if (isNaN(bookId)) {
    throw error(404, 'Not found');
  }

  const book = await db.select().from(books).where(eq(books.id, bookId));

  if (book.length === 0) {
    throw error(404, 'Not found');
  }

  let inBookshelf = false;
  let progress = 0;
  if (session?.user?.id) {
    const bookshelfEntry = await db.select().from(userBookshelf).where(and(eq(userBookshelf.userId, session.user.id), eq(userBookshelf.bookId, bookId)));
    if (bookshelfEntry.length > 0) {
      inBookshelf = true;
      progress = bookshelfEntry[0].progress;
    }
  }

  const bookPages = await db.select().from(pages).where(eq(pages.bookId, bookId)).orderBy(pages.pageNumber);

  return {
    book: book[0],
    pages: bookPages,
    inBookshelf,
    progress,
  };
};
