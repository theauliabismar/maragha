<script lang="ts">
  import { onMount } from 'svelte';
  import {
    DataTable,
    Checkbox,
  } from 'carbon-components-svelte';
  import type { permissions as permissionType, roles as roleType } from '$lib/server/db/schema';
  import type { TableHeader } from 'carbon-components-svelte';

  let permissions: (typeof permissionType.$inferSelect)[] = [];
  let roles: (typeof roleType.$inferSelect)[] = [];
  let tables = ['users', 'roles', 'permissions', 'publishers', 'books', 'pages', 'authors', 'categories'];

  onMount(async () => {
    const permissionsResponse = await fetch('/admin/permissions/api');
    permissions = await permissionsResponse.json();

    const rolesResponse = await fetch('/admin/roles/api');
    roles = await rolesResponse.json();
  });

  function getPermission(roleId: string, tableName: string, action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete') {
    return permissions.find(p => p.roleId === roleId && p.tableName === tableName)?.[action] ?? false;
  }

  async function updatePermission(roleId: string, tableName: string, action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete', value: boolean) {
    const permission = permissions.find(p => p.roleId === roleId && p.tableName === tableName);
    if (permission) {
      await fetch('/admin/permissions/api', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...permission, [action]: value }),
      });
    } else {
      await fetch('/admin/permissions/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `${roleId}-${tableName}`,
          roleId,
          tableName,
          canCreate: action === 'canCreate' ? value : false,
          canRead: action === 'canRead' ? value : false,
          canUpdate: action === 'canUpdate' ? value : false,
          canDelete: action === 'canDelete' ? value : false,
        }),
      });
    }
    const permissionsResponse = await fetch('/admin/permissions/api');
    permissions = await permissionsResponse.json();
  }
</script>

<h1>Permissions</h1>

<DataTable
  headers={[
    { key: 'tableName', value: 'Table' },
    ...(roles.map(role => ({ key: role.id ?? '', value: role.name ?? '' })) as any),
  ]}
  rows={tables.map(tableName => ({ id: tableName, tableName }))}
>
  <svelte:fragment slot="cell" let:row let:cell>
    {#if cell.key === 'tableName'}
      {row.tableName}
    {:else}
      <div>
        <Checkbox
          labelText="Create"
          checked={getPermission(cell.key, row.tableName, 'canCreate')}
          on:change={(e) => {
            if (e.target instanceof HTMLInputElement) {
              updatePermission(cell.key, row.tableName, 'canCreate', e.target.checked)
            }
          }}
        />
        <Checkbox
          labelText="Read"
          checked={getPermission(cell.key, row.tableName, 'canRead')}
          on:change={(e) => {
            if (e.target instanceof HTMLInputElement) {
              updatePermission(cell.key, row.tableName, 'canRead', e.target.checked)
            }
          }}
        />
        <Checkbox
          labelText="Update"
          checked={getPermission(cell.key, row.tableName, 'canUpdate')}
          on:change={(e) => {
            if (e.target instanceof HTMLInputElement) {
              updatePermission(cell.key, row.tableName, 'canUpdate', e.target.checked)
            }
          }}
        />
        <Checkbox
          labelText="Delete"
          checked={getPermission(cell.key, row.tableName, 'canDelete')}
          on:change={(e) => {
            if (e.target instanceof HTMLInputElement) {
              updatePermission(cell.key, row.tableName, 'canDelete', e.target.checked)
            }
          }}
        />
      </div>
    {/if}
  </svelte:fragment>
</DataTable>
