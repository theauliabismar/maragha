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
	import type { publishers } from '$lib/server/db/schema';

	export let data;
	let open = false;
	let currentPublisher: (typeof publishers.$inferSelect) | null = null;

	const headers: any[] = [
		{ key: 'name', value: 'Name' },
		{ key: 'actions', value: 'Actions', sortable: false }
	];
</script>

<DataTable {headers} rows={data.publishers}>
	<Toolbar>
		<ToolbarContent>
			<ToolbarSearch />
			<Button
				icon={Add}
				on:click={() => {
					currentPublisher = null;
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
					currentPublisher = row;
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
	modalHeading={currentPublisher ? 'Edit publisher' : 'Add new publisher'}
	primaryButtonText={currentPublisher ? 'Save' : 'Add'}
	secondaryButtonText="Cancel"
	on:submit={() => {
		open = false;
	}}
>
	<form method="POST" action={currentPublisher ? '?/update' : '?/create'} use:enhance>
		<input type="hidden" name="id" value={currentPublisher?.id} />
		<TextInput labelText="Name" name="name" value={currentPublisher?.name} />
	</form>
</Modal>
