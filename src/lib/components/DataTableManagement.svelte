<script lang="ts">
  import {
    Button,
    DataTable,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    ToolbarBatchActions,
    Modal,
    TextInput,
    TextArea,
    Select,
    SelectItem,
  } from "carbon-components-svelte";
  import { Add, TrashCan, Edit, Data_2 } from "carbon-icons-svelte";
  import { enhance } from "$app/forms";

  export let title: string;
  export let headers: any[] = [];
  export let rows: any[] = [];
  export let fields: FieldConfig[] = [];
  export let hiddenColumns: string[] = [];

  interface FieldConfig {
    name: string;
    label: string;
    type: "text" | "textarea" | "select";
    options?: { value: any; label: string }[];
    required?: boolean;
  }

  let selectedRowIds: number[] = [];
  let isModalOpen = false;
  let isEditing = false;
  let searchTerm = "";
  let currentData: any = null;
  let editForm: HTMLFormElement;

  $: filteredRows = rows.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }).map(row=>{
    const filtered: any = {};
    headers.forEach(header => {
      console.log(1, header)
      if(!hiddenColumns.includes(header.key)) {
        console.log(2, header)
        filtered[header.key] = row[header.key];
      }
    });
    filtered.id = row.id;
    console.log(filtered)
    return filtered;
  });

  function openCreateModal() {
    currentData = null;
    isEditing = false;
    isModalOpen = true;
  }

  function openEditModal() {
    if (selectedRowIds.length !== 1) return;
    const selected = rows.find((r) => r.id === selectedRowIds[0]);
    currentData = { ...selected };
    isEditing = true;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    currentData = null;
    selectedRowIds = [];
  }

  function handleSubmit() {
    if (editForm) {
      editForm.requestSubmit();
    }
    closeModal();
  }

  function getFieldValue(fieldName: string) {
    return currentData?.[fieldName] ?? "";
  }

  function getFieldType(field: FieldConfig) {
    return field.type;
  }
</script>

<DataTable radio bind:selectedRowIds {headers} rows={filteredRows} on:click>
  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch bind:value={searchTerm} placeholder="Search..." />
      <Button on:click={openCreateModal} icon={Add}>Create</Button>
      <!-- <ToolbarMenu>
        <ToolbarMenuItem on:click={openCreateModal}>
          <Add size={16} />
          Create
        </ToolbarMenuItem> 
      </ToolbarMenu> -->
    </ToolbarContent>
    {#if selectedRowIds.length > 0}
      <ToolbarBatchActions on:cancel={() => (selectedRowIds = [])}>
        <form method="POST" action="?/delete" use:enhance>
          <input type="hidden" name="id" value={selectedRowIds[0]} />
          <Button
            icon={TrashCan}
            kind="danger"
            type="submit"
            on:click={() => (selectedRowIds = [])}
          >
            Delete
          </Button>
        </form>
        <Button
          icon={Edit}
          kind="secondary"
          disabled={selectedRowIds.length !== 1}
          on:click={openEditModal}
        >
          Edit
        </Button>
      </ToolbarBatchActions>
    {/if}
  </Toolbar>
</DataTable>

<Modal
  open={isModalOpen}
  modalHeading={isEditing ? `Edit ${title}` : `Create ${title}`}
  primaryButtonText={isEditing ? "Save" : "Create"}
  secondaryButtonText="Cancel"
  on:click:button--secondary={closeModal}
  on:submit={handleSubmit}
>
  <form
    bind:this={editForm}
    method="POST"
    action={isEditing ? "?/update" : "?/create"}
    use:enhance
  >
    {#if isEditing}
      <input type="hidden" name="id" value={currentData?.id} />
    {/if}

    {#each fields as field}
      {#if getFieldType(field) === "text"}
        <div style="margin-bottom: 1rem;">
          <TextInput
            labelText={field.label}
            name={field.name}
            value={getFieldValue(field.name)}
            required={field.required}
          />
        </div>
      {:else if getFieldType(field) === "textarea"}
        <div style="margin-bottom: 1rem;">
          <TextArea
            labelText={field.label}
            name={field.name}
            value={getFieldValue(field.name)}
            required={field.required}
          />
        </div>
      {:else if getFieldType(field) === "select"}
        <div style="margin-bottom: 1rem;">
          <Select
            labelText={field.label}
            name={field.name}
            selected={getFieldValue(field.name)}
            required={field.required}
          >
            {#if field.options}
              {#each field.options as option}
                <SelectItem value={option.value} text={option.label} />
              {/each}
            {/if}
          </Select>
        </div>
      {/if}
    {/each}
  </form>
</Modal>

<!-- <style>
	:global(.bx--toolbar-batch-actions) {
		display: flex;
		gap: 0.5rem;
	}
</style> -->
