<script lang="ts">
  import Shell from '$lib/components/admin/Shell.svelte';
  import { pageTitle } from '$lib/stores/titleStore';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

<Shell title={$pageTitle}>
  <slot />
</Shell>