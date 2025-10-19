<script lang="ts">
	import {
		Button,
		DataTable,
		Modal,
		TextInput,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
	} from "carbon-components-svelte";
	import { Add, TrashCan, Edit } from "carbon-icons-svelte";
	import { enhance } from "$app/forms";
	import { pageTitle } from "$lib/stores/titleStore";
	import type { authors } from "$lib/server/db/schema";
	export let data;
	pageTitle.set('Manage Authors');
	let open = false;
	let currentAuthor: typeof authors.$inferSelect | null = null;
	let authorForm: HTMLFormElement; // Declare a variable to bind to the form
	const headers: any[] = [
		{ key: "name", value: "Name" },
		{ key: "actions", value: "Actions", sortable: false },
	];
</script>

<DataTable {headers} rows={data.authors}>
	<Toolbar>
		<ToolbarContent>
			<ToolbarSearch />
			<Button
				icon={Add}
				on:click={() => {
					currentAuthor = null;
					open = true;
				}}>Add new</Button
			>
		</ToolbarContent>
	</Toolbar>
	<svelte:fragment slot="cell" let:row let:cell>
		{#if cell.key === "actions"}
			<Button
				icon={Edit}
				kind="ghost"
				on:click={() => {
					currentAuthor = row;
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
	modalHeading={currentAuthor ? "Edit author" : "Add new author"}
	primaryButtonText={currentAuthor ? "Save" : "Add"}
	secondaryButtonText="Cancel"
	on:submit={() => {
		// Programmatically submit the form using the bound element
		if (authorForm) {
			authorForm.requestSubmit();
		}
		open = false; // Close the modal after submission
	}}
>
	<form
		bind:this={authorForm}
		method="POST"
		action={currentAuthor ? "?/update" : "?/create"}
		use:enhance
	>
		<input type="hidden" name="id" value={currentAuthor?.id} />
		<TextInput labelText="Name" name="name" value={currentAuthor?.name} />
	</form>
</Modal>