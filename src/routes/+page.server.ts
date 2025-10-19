import { db } from '$lib/server/db';
import { books, authors, bookAuthors, categories, bookCategories } from '$lib/server/db/schema';
import { eq, like } from 'drizzle-orm';

export const load = async ({ url }) => {
  const query = url.searchParams.get('q') ?? '';
  const author = url.searchParams.get('author') ?? '';
  const category = url.searchParams.get('category') ?? '';

  let queryBuilder = db.select({
    id: books.id,
    title: books.title,
    author: authors.name,
    category: categories.name,
  }).from(books)
    .leftJoin(bookAuthors, eq(books.id, bookAuthors.bookId))
    .leftJoin(authors, eq(bookAuthors.authorId, authors.id))
    .leftJoin(bookCategories, eq(books.id, bookCategories.bookId))
    .leftJoin(categories, eq(bookCategories.categoryId, categories.name))
    .where(eq(books.status, 'terbit'));

  if (query) {
    queryBuilder = queryBuilder.where(like(books.title, `%${query}%`));
  }
  if (author) {
    queryBuilder = queryBuilder.where(eq(authors.id, Number(author)));
  }
  if (category) {
    queryBuilder = queryBuilder.where(eq(categories.name, category));
  }

  const allBooks = await queryBuilder;
	const allAuthors = await db.select().from(authors);
	const allCategories = await db.select().from(categories);

  return {
    books: allBooks,
    authors: allAuthors,
    categories: allCategories,
    query,
    selectedAuthor: author,
    selectedCategory: category,
  };
};
