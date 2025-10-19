<script lang="ts">
	import {
		Button,
		DataTable,
		Modal,
		TextInput,
		Toolbar,
		ToolbarContent,
		ToolbarSearch
	} from 'carbon-components-svelte';
	import { Add, TrashCan, Edit } from 'carbon-icons-svelte';
	import { enhance } from '$app/forms';
	import type { categories } from '$lib/server/db/schema';

	export let data;
	let open = false;
	let currentCategory: (typeof categories.$inferSelect) | null = null;

	const headers: any[] = [
		{ key: 'name', value: 'Name' },
		{ key: 'actions', value: 'Actions', sortable: false }
	];
</script>

<DataTable {headers} rows={data.categories}>
	<Toolbar>
		<ToolbarContent>
			<ToolbarSearch />
			<Button
				icon={Add}
				on:click={() => {
					currentCategory = null;
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
					currentCategory = row;
					open = true;
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
	modalHeading={currentCategory ? 'Edit category' : 'Add new category'}
	primaryButtonText={currentCategory ? 'Save' : 'Add'}
	secondaryButtonText="Cancel"
	on:submit={() => {
		open = false;
	}}
>
	<form method="POST" action={currentCategory ? '?/update' : '?/create'} use:enhance>
		<input type="hidden" name="id" value={currentCategory?.id} />
		<TextInput labelText="Name" name="name" value={currentCategory?.name} />
	</form>
</Modal>
