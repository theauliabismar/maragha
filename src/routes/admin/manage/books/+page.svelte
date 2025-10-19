<script lang="ts">
	import {
		Button,
		DataTable,
		Modal,
		TextInput,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		ComboBox,
		MultiSelect
	} from 'carbon-components-svelte';
	import { Add, TrashCan, Edit } from 'carbon-icons-svelte';
	import { enhance } from '$app/forms';
	import { pageTitle } from '$lib/stores/titleStore';
	import type { books } from '$lib/server/db/schema';
	export let data;
	pageTitle.set('Manage Books');
	let open = false;
	let currentBook: (typeof books.$inferSelect) | null = null;
	let bookForm: HTMLFormElement;
	const headers: any[] = [
		{ key: 'title', value: 'Title' },
		{ key: 'author', value: 'Author' },
		{ key: 'category', value: 'Category' },
		{ key: 'status', value: 'Status' },
		{ key: 'actions', value: 'Actions', sortable: false }
	];

	let authorIds: number[] = [];
	let categoryNames: string[] = [];
	let publisherId: number | undefined;
	let publisherSelectedId: string | number | undefined;
	let status: 'draft' | 'terbit' | 'batal' = 'draft';
	let title: string = '';

	$: isFormValid = title && authorIds.length > 0 && categoryNames.length > 0;

	function handleEdit(row: typeof books.$inferSelect) {
		currentBook = row;
		const book = currentBook;
		title = book.title || '';
		if (book && data.bookAuthors && data.bookCategories) {
			const authorLinks = data.bookAuthors.filter((ba) => ba.bookId === book.id);
			authorIds = authorLinks.map((link) => link.authorId).filter((id): id is number => id !== null);
			const categoryLinks = data.bookCategories.filter((bc) => bc.bookId === book.id);
			categoryNames = categoryLinks.map((link) => link.categoryId).filter((name): name is string => name !== null && name !== undefined);
			if (book.publisherId) {
				publisherId = book.publisherId;
				publisherSelectedId = book.publisherId;
			}
			status = book.status;
		}
		open = true;
	}
  function shouldFilterItem(item, value) {
    if (!value) return true;
    return item.text.toLowerCase().includes(value.toLowerCase());
  }	
</script>

<DataTable {headers} rows={data.books} let:row>
	<Toolbar>
		<ToolbarContent>
			<ToolbarSearch />
			<Button
				icon={Add}
				on:click={() => {
					currentBook = null;
					authorIds = [];
					categoryNames = [];
					publisherId = undefined;
					publisherSelectedId = undefined;
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
	primaryButtonDisabled={!isFormValid}
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
			<input type="hidden" name="authors" value={JSON.stringify(authorIds)} />
			<input type="hidden" name="categories" value={JSON.stringify(categoryNames)} />
			<input type="hidden" name="publisher" value={publisherSelectedId || ''} />
			<TextInput labelText="Title" name="title" bind:value={title} />
			<div class="form-row">
				<TextInput labelText="Edition" name="edition" value={currentBook?.edition || '1'} readonly />
				<TextInput labelText="Status" name="status" value={status} disabled />
			</div>
			<MultiSelect
				titleText="Author"
				label="Select authors"
				filterable
				items={data.authors.map((author) => ({ id: author.id, text: author.name }))}
				bind:selectedIds={authorIds}
			/>
			<MultiSelect
				titleText="Category"
				label="Select categories"
				filterable
				items={data.categories.map((cat) => ({ id: cat.name, text: cat.name }))}
				bind:selectedIds={categoryNames}
			/>
			<ComboBox
				titleText="Publisher"
				placeholder="Select publisher"
				items={data.publishers.map((pub) => ({ id: pub.id, text: pub.name }))}
				bind:selectedId={publisherSelectedId}
				{shouldFilterItem}
			/>
		</form>
	{/if}
</Modal>

<style>
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
</style>