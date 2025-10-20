<script lang="ts">
	import DataTableManagement from '$lib/components/DataTableManagement.svelte';
	import { pageTitle } from '$lib/stores/titleStore';

	export let data;

	pageTitle.set('Manage Books');

	const headers = [
		{ key: 'title', value: 'Title' },
		{ key: 'author', value: 'Author' },
		{ key: 'category', value: 'Category' },
		{ key: 'status', value: 'Status' }
	];

	const fields: Array<{
		name: string;
		label: string;
		type: 'text' | 'textarea' | 'select' | 'multiselect' | 'combobox';
		options?: { value: any; label: string }[];
		required?: boolean;
	}> = [
		{
			name: 'title',
			label: 'Title',
			type: 'text',
			required: true
		},
		{
			name: 'edition',
			label: 'Edition',
			type: 'text'
		},
		{
			name: 'authors',
			label: 'Authors',
			type: 'multiselect',
			options: data.authors.map((author) => ({ value: author.id, label: author.name })),
			required: true
		},
		{
			name: 'categories',
			label: 'Categories',
			type: 'multiselect',
			options: data.categories.map((cat) => ({ value: cat.name, label: cat.name })),
			required: true
		},
		{
			name: 'publisher',
			label: 'Publisher',
			type: 'combobox',
			options: data.publishers.map((pub) => ({ value: pub.id, label: pub.name }))
		},
		{
			name: 'status',
			label: 'Status',
			type: 'select',
			options: [
				{ value: 'draft', label: 'Draft' },
				{ value: 'terbit', label: 'Terbit' },
				{ value: 'batal', label: 'Batal' }
			]
		}
	];

	// Prepare rows with proper field mapping
	const rows = data.books.map((book) => {
		const authorLinks = data.bookAuthors.filter((ba) => ba.bookId === book.id);
		const authorIds = authorLinks
			.map((link) => link.authorId)
			.filter((id): id is number => id !== null);

		const categoryLinks = data.bookCategories.filter((bc) => bc.bookId === book.id);
		const categoryNames = categoryLinks
			.map((link) => link.categoryId)
			.filter((name): name is string => name !== null && name !== undefined);

		return {
			...book,
			authors: authorIds,
			categories: categoryNames,
			publisher: book.publisherId
		};
	});
</script>

<DataTableManagement
	title="Book"
	{headers}
	{rows}
	{fields}
	hiddenColumns={['id', 'revision', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'publisherId', 'edition', 'authors', 'categories', 'publisher']}
	permissions={data.permissions}
/>