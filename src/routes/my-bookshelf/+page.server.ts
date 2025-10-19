import { db } from '$lib/server/db';
import { userBookshelf, books, authors, bookAuthors, categories, bookCategories } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
  const session = await event.locals.auth();
  if (!session?.user?.id) {
    throw redirect(302, '/login');
  }

  const userBooks = await db.select().from(userBookshelf).where(eq(userBookshelf.userId, session.user.id));
  const bookIds = userBooks.map((ub) => ub.bookId).filter((id): id is number => id !== null);

  if (bookIds.length === 0) {
    return { books: [] };
  }

  const allBooks = await db.select().from(books).where(inArray(books.id, bookIds));
  const allAuthors = await db.select().from(authors);
	const allCategories = await db.select().from(categories);
	const allBookAuthors = await db.select().from(bookAuthors);
	const allBookCategories = await db.select().from(bookCategories);

  return {
    books: allBooks.map((book) => {
			const authorLink = allBookAuthors.find((ba) => ba.bookId === book.id);
			const author = allAuthors.find((a) => a.id === authorLink?.authorId);
			const categoryLink = allBookCategories.find((bc) => bc.bookId === book.id);
			const category = allCategories.find((c) => c.name === categoryLink?.categoryId);
			return {
				...book,
				author: author?.name,
				category: category?.name
			};
		}),
  };
};
