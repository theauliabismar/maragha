<script lang="ts">
	import DataTableManagement from '$lib/components/DataTableManagement.svelte';
	import { pageTitle } from '$lib/stores/titleStore';

	export let data;

	pageTitle.set('Atur Penulis');

	const headers = [
		{ key: 'name', value: 'Name' }
	];

	const fields: Array<{
		name: string;
		label: string;
		type: 'text' | 'textarea' | 'select';
		required?: boolean;
	}> = [
		{
			name: 'name',
			label: 'Nama Penulis',
			type: 'text',
			required: true
		}
	];
</script>

<DataTableManagement
	title="Penulis"
	{headers}
	rows={data.authors}
	{fields}
	hiddenColumns={['id']}
/>