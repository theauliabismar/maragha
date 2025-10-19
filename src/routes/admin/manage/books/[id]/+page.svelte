<script lang="ts">
	import {
		Button,
		DataTable,
		Modal,
		TextArea,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Select,
		SelectItem
	} from 'carbon-components-svelte';
	import { Add, TrashCan, Edit } from 'carbon-icons-svelte';
	import { enhance } from '$app/forms';
	import { pageTitle } from '$lib/stores/titleStore';
	import type { pages } from '$lib/server/db/schema';
	export let data;
	if (data.book) {
		pageTitle.set(`Manage Pages for ${data.book.title}`);
	}
	let open = false;
	let currentPage: typeof pages.$inferSelect | null = null;
	let pageForm: HTMLFormElement;
	let status: 'draft' | 'ulas' | 'setuju' | 'revisi' = 'draft';

	const headers: any[] = [
		{ key: 'pageNumber', value: 'Page Number' },
		{ key: 'originalText', value: 'Original Text' },
		{ key: 'translation', value: 'Translation' },
		{ key: 'status', value: 'Status' },
		{ key: 'actions', value: 'Actions', sortable: false }
	];

	function handleEdit(row: typeof pages.$inferSelect) {
		currentPage = row;
		status = row.status;
		open = true;
	}
</script>

<DataTable {headers} rows={data.pages}>
	<Toolbar>
		<ToolbarContent>
			<ToolbarSearch />
			<Button
				icon={Add}
				on:click={() => {
					currentPage = null;
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
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>
<Modal
	bind:open
	modalHeading={currentPage ? 'Edit page' : 'Add new page'}
	primaryButtonText={currentPage ? 'Save' : 'Add'}
	secondaryButtonText="Cancel"
	on:submit={() => {
		if (pageForm) {
			pageForm.requestSubmit();
		}
		open = false;
	}}
>
	{#if open}
		<form
			bind:this={pageForm}
			method="POST"
			action={currentPage ? '?/update' : '?/create'}
			use:enhance
		>
			<input type="hidden" name="id" value={currentPage?.id} />
			<div class="grid grid-cols-2 gap-4">
				<div>
					<TextArea
						labelText="Original Text"
						name="originalText"
						value={currentPage?.originalText}
					/>
				</div>
				<div>
					<TextArea
						labelText="Translation"
						name="translation"
						value={currentPage?.translation}
					/>
				</div>
			</div>
			<Select labelText="Status" name="status" bind:selected={status}>
				<SelectItem value="draft" text="Draft" />
				<SelectItem value="ulas" text="Review" />
				<SelectItem value="setuju" text="Approved" />
				<SelectItem value="revisi" text="Revision" />
			</Select>
		</form>
	{/if}
</Modal>
<style>
	.grid {
		display: grid;
	}
	.grid-cols-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.gap-4 {
		gap: 1rem;
	}
</style>