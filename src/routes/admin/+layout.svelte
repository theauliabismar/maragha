<script lang="ts">
  import Shell from '$lib/components/admin/Shell.svelte';
  import type { LayoutData } from './$types';
  export let data: LayoutData;
</script>

<Shell title={data.title}>
  <slot />
</Shell>