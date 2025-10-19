<script lang="ts">
	import {
		Button,
		DataTable,
		Modal,
		TextInput,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Select,
		SelectItem
	} from 'carbon-components-svelte';
	import { Add, TrashCan, Edit } from 'carbon-icons-svelte';
	import { enhance } from '$app/forms';
	import { pageTitle } from '$lib/stores/titleStore';
	import type { books } from '$lib/server/db/schema';
	export let data;
	pageTitle.set('Manage Books');
	let open = false;
	let currentBook: (typeof books.$inferSelect & { authorId?: number; categoryId?: number }) | null =
		null;
	let bookForm: HTMLFormElement;
	const headers: any[] = [
		{ key: 'title', value: 'Title' },
		{ key: 'author', value: 'Author' },
		{ key: 'category', value: 'Category' },
		{ key: 'status', value: 'Status' },
		{ key: 'actions', value: 'Actions', sortable: false }
	];

	let authorId: number | undefined;
	let categoryId: number | undefined;
	let publisherId: number | undefined;
	let status: 'draft' | 'terbit' | 'batal' = 'draft';

	function handleEdit(row: typeof books.$inferSelect) {
		currentBook = row;
		const book = currentBook;
		if (book && data.bookAuthors && data.bookCategories) {
			const authorLink = data.bookAuthors.find((ba) => ba.bookId === book.id);
			if (authorLink && authorLink.authorId) {
				authorId = authorLink.authorId;
			}
			const categoryLink = data.bookCategories.find((bc) => bc.bookId === book.id);
			if (categoryLink && categoryLink.categoryId) {
				categoryId = categoryLink.categoryId;
			}
			if (book.publisherId) {
				publisherId = book.publisherId;
			}
			status = book.status;
		}
		open = true;
	}
</script>

<DataTable {headers} rows={data.books}>
	<Toolbar>
		<ToolbarContent>
			<ToolbarSearch />
			<Button
				icon={Add}
				on:click={() => {
					currentBook = null;
					authorId = undefined;
					categoryId = undefined;
					publisherId = undefined;
					status = 'draft';
					open = true;
				}}>Add new</Button
			>
		</ToolbarContent>
	</Toolbar>
	<svelte:fragment slot="cell" let:row let:cell>
		{#if cell.key === 'actions'}
			<Button
				icon={Edit}
				kind="ghost"
				on:click={() => {
					handleEdit(row);
				}}
			/>
			<form method="POST" action="?/delete" use:enhance>
				<input type="hidden" name="id" value={row.id} />
				<Button icon={TrashCan} kind="ghost" type="submit" />
			</form>
		{:else if cell.key === 'title'}
			<a href="/admin/manage/books/{row.id}">{cell.value}</a>
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>
<Modal
	bind:open
	modalHeading={currentBook ? 'Edit book' : 'Add new book'}
	primaryButtonText={currentBook ? 'Save' : 'Add'}
	secondaryButtonText="Cancel"
	on:submit={() => {
		if (bookForm) {
			bookForm.requestSubmit();
		}
		open = false;
	}}
>
	{#if open}
		<form
			bind:this={bookForm}
			method="POST"
			action={currentBook ? '?/update' : '?/create'}
			use:enhance
		>
			<input type="hidden" name="id" value={currentBook?.id} />
			<TextInput labelText="Title" name="title" value={currentBook?.title} />
			<TextInput labelText="Edition" name="edition" value={currentBook?.edition} />
			<Select labelText="Status" name="status" bind:selected={status}>
				<SelectItem value="draft" text="Draft" />
				<SelectItem value="terbit" text="Published" />
				<SelectItem value="batal" text="Cancelled" />
			</Select>
			<Select labelText="Author" name="author" bind:selected={authorId}>
				{#each data.authors as author}
					<SelectItem value={author.id} text={author.name} />
				{/each}
			</Select>
			<Select labelText="Category" name="category" bind:selected={categoryId}>
				{#each data.categories as category}
					<SelectItem value={category.id} text={category.name} />
				{/each}
			</Select>
			<Select labelText="Publisher" name="publisher" bind:selected={publisherId}>
				{#each data.publishers as publisher}
					<SelectItem value={publisher.id} text={publisher.name} />
				{/each}
			</Select>
		</form>
	{/if}
</Modal>