<script lang="ts">
  import Shell from '$lib/components/admin/Shell.svelte';
  import { pageTitle } from '$lib/stores/titleStore';
</script>

<Shell title={$pageTitle}>
  <slot />
</Shell>