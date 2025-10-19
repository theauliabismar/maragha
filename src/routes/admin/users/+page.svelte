<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Button,
    DataTable,
    Modal,
    Select,
    SelectItem,
  } from 'carbon-components-svelte';
  import { User } from 'carbon-icons-svelte';
  import type { users as userType, roles as roleType } from '$lib/server/db/schema';

  let users: (typeof userType.$inferSelect)[] = [];
  let roles: (typeof roleType.$inferSelect)[] = [];
  let selectedUser: (typeof userType.$inferSelect) | null = null;
  let selectedRole: string | number = '';
  let isModalOpen = false;

  onMount(async () => {
    const usersResponse = await fetch('/admin/users/api');
    users = await usersResponse.json();

    const rolesResponse = await fetch('/admin/roles/api');
    roles = await rolesResponse.json();
  });

  function openModal(user: typeof userType.$inferSelect) {
    selectedUser = user;
    isModalOpen = true;
  }

  async function assignRole() {
    if (!selectedUser) return;
    await fetch('/admin/user-roles/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser.id, roleId: selectedRole }),
    });
    isModalOpen = false;
  }
</script>

<h1>Users</h1>

<DataTable
  headers={[
    { key: 'name', value: 'Name' },
    { key: 'email', value: 'Email' },
    { key: 'actions', value: 'Actions' },
  ] as any}
  rows={users}
>
  <svelte:fragment slot="cell" let:row let:cell>
    {#if cell.key === 'actions'}
      <Button on:click={() => openModal(row)}>Assign Role</Button>
    {:else}
      {row[cell.key as keyof typeof row]}
    {/if}
  </svelte:fragment>
</DataTable>

<Modal
  bind:open={isModalOpen}
  modalHeading="Assign Role"
  primaryButtonText="Assign"
  secondaryButtonText="Cancel"
  on:click:button--primary={assignRole}
>
  <Select labelText="Role" bind:selected={selectedRole}>
    {#each roles as role}
      <SelectItem value={role.id} text={role.name} />
    {/each}
  </Select>
</Modal>
