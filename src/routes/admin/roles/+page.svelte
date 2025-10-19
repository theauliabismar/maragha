<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Button,
    DataTable,
    Modal,
    TextInput,
  } from 'carbon-components-svelte';
  import type { roles as roleType } from '$lib/server/db/schema';

  let roles: (typeof roleType.$inferSelect)[] = [];
  let isModalOpen = false;
  let newRoleName = '';
  let newRoleId = '';

  onMount(async () => {
    const rolesResponse = await fetch('/admin/roles/api');
    roles = await rolesResponse.json();
  });

  async function createRole() {
    await fetch('/admin/roles/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newRoleId, name: newRoleName }),
    });
    isModalOpen = false;
    const rolesResponse = await fetch('/admin/roles/api');
    roles = await rolesResponse.json();
  }
</script>

<h1>Roles</h1>

<Button on:click={() => (isModalOpen = true)}>Create Role</Button>

<DataTable
  headers={[
    { key: 'name', value: 'Name' },
    { key: 'id', value: 'ID' },
  ]}
  rows={roles}
/>

<Modal
  bind:open={isModalOpen}
  modalHeading="Create Role"
  primaryButtonText="Create"
  secondaryButtonText="Cancel"
  on:click:button--primary={createRole}
>
  <TextInput labelText="Role ID" bind:value={newRoleId} />
  <TextInput labelText="Role Name" bind:value={newRoleName} />
</Modal>
