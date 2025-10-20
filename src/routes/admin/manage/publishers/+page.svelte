<script lang="ts">
	import DataTableManagement from '$lib/components/DataTableManagement.svelte';
	import { pageTitle } from '$lib/stores/titleStore';

	export let data;

	pageTitle.set('Atur Penerbit');

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
			label: 'Penerbit',
			type: 'text',
			required: true
		}
	];
</script>

<DataTableManagement
	title="Penulis"
	{headers}
	rows={data.publishers}
	{fields}
	hiddenColumns={['id']}
/>