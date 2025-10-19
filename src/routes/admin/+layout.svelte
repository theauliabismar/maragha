<script lang="ts">
  import Shell from '$lib/components/admin/Shell.svelte';
  import type { LayoutData } from './$types';
  export let data: LayoutData;
</script>

<!-- Add this pre tag for debugging -->
<pre style="position: fixed; top: 10px; right: 10px; background: #eee; padding: 1rem; z-index: 9999;">
  {JSON.stringify(data, null, 2)}
</pre>

<Shell title={data.title}>
  <slot />
</Shell>