<script lang="ts">
  import {
    Button,
    DataTable,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarBatchActions,
    Modal,
    TextInput,
    TextArea,
    Select,
    SelectItem,
    MultiSelect,
    ComboBox
  } from "carbon-components-svelte";
  import { Add, TrashCan, Edit } from "carbon-icons-svelte";
  import { enhance } from "$app/forms";
  import { tick } from "svelte";

  export let title: string;
  export let headers: any[] = [];
  export let rows: any[] = [];
  export let fields: FieldConfig[] = [];
  export let hiddenColumns: string[] = [];
  export let permissions: {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  } = { canCreate: true, canUpdate: true, canDelete: true };

  interface FieldConfig {
    name: string;
    label: string;
    type: "text" | "textarea" | "select" | "multiselect" | "combobox";
    options?: { value: any; label: string }[];
    required?: boolean;
  }

  let selectedRowIds: number[] = [];
  let isModalOpen = false;
  let isEditing = false;
  let searchTerm = "";
  let currentData: any = null;
  let editForm: HTMLFormElement;
  let deleteForm: HTMLFormElement;
  let isSubmitting = false;
  let formData: Record<string, any> = {};

  $: filteredRows = rows
    .filter((row) => {
      if (!searchTerm) return true;
      return Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .map((row) => {
      const filtered: any = {};
      headers.forEach((header) => {
        filtered[header.key] = row[header.key];
      });
      filtered.id = row.id;
      return filtered;
    });

  function openCreateModal() {
    currentData = null;
    isEditing = false;
    formData = {};
    fields.forEach((field) => {
      if (field.type === "multiselect") {
        formData[field.name] = [];
      } else {
        formData[field.name] = "";
      }
    });
    isModalOpen = true;
  }

  function openEditModal() {
    if (selectedRowIds.length !== 1) return;
    const selected = rows.find((r) => r.id === selectedRowIds[0]);
    currentData = { ...selected };
    formData = {};
    fields.forEach((field) => {
      if (field.type === "multiselect") {
        formData[field.name] = selected[field.name] || [];
      } else {
        formData[field.name] = selected[field.name] ?? "";
      }
    });
    isEditing = true;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    currentData = null;
    selectedRowIds = [];
    isSubmitting = false;
    formData = {};
  }

  function handleModalSubmit() {
    if (isSubmitting) return;
    if (editForm) {
      editForm.requestSubmit();
    }
  }

  function handleDelete() {
    if (deleteForm) {
      const selectedRow = rows.find((r) => r.id === selectedRowIds[0]);
      if (selectedRow) {
        const hiddenInput = deleteForm.querySelector(
          'input[name="id"]'
        ) as HTMLInputElement;
        if (hiddenInput) {
          hiddenInput.value = selectedRow.id;
        }
      }
      deleteForm.requestSubmit();
      selectedRowIds = [];
    }
  }

  async function setInitialFocus() {
    await tick();
    if (editForm) {
      const firstField = editForm.querySelector(
        'input:not([type="hidden"]):not([disabled]):not([readonly]), ' +
          'textarea:not([disabled]):not([readonly]), ' +
          'select:not([disabled]):not([readonly])'
      ) as HTMLElement | null;
      if (firstField) {
        firstField.focus();
      }
    }
  }

  function getFieldType(field: FieldConfig) {
    return field.type;
  }

  function shouldFilterItem(item: { text: string }, value: string) {
    if (!value) return true;
    return item.text.toLowerCase().includes(value.toLowerCase());
  }
</script>

<DataTable
  radio
  bind:selectedRowIds
  {headers}
  rows={filteredRows}
  on:click:row={(e) => (selectedRowIds = [e.detail.id])}
>
  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch bind:value={searchTerm} placeholder="Search..." />
      <Button
        on:click={openCreateModal}
        icon={Add}
        disabled={!permissions.canCreate}
      >
        Create
      </Button>
    </ToolbarContent>
    {#if selectedRowIds.length > 0}
      <ToolbarBatchActions on:cancel={() => (selectedRowIds = [])}>
        <form bind:this={deleteForm} method="POST" action="?/delete" use:enhance>
          <input type="hidden" name="id" value={rows[selectedRowIds[0]]?.id} />
          <Button
            icon={TrashCan}
            kind="danger"
            type="button"
            on:click={handleDelete}
            disabled={!permissions.canDelete}
          >
            Delete
          </Button>
        </form>
        <Button
          icon={Edit}
          kind="secondary"
          disabled={selectedRowIds.length !== 1 || !permissions.canUpdate}
          on:click={openEditModal}
        >
          Edit
        </Button>
      </ToolbarBatchActions>
    {/if}
  </Toolbar>
</DataTable>

<Modal
  bind:open={isModalOpen}
  modalHeading={isEditing ? `Edit ${title}` : `Create ${title}`}
  primaryButtonText={isEditing ? "Save" : "Create"}
  secondaryButtonText="Cancel"
  primaryButtonDisabled={isSubmitting}
  on:click:button--secondary={closeModal}
  on:submit={handleModalSubmit}
  on:open={setInitialFocus}
>
  <form
    bind:this={editForm}
    method="POST"
    action={isEditing ? "?/update" : "?/create"}
    on:submit|preventDefault
    use:enhance={() => {
      if (isSubmitting) return;
      isSubmitting = true;
      return async ({ result, update }) => {
        if (result.type === "success" || result.status === 200) {
          await update();
          closeModal();
        } else {
          isSubmitting = false;
        }
      };
    }}
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
            bind:value={formData[field.name]}
            required={field.required}
            disabled={isSubmitting}
          />
        </div>
      {:else if getFieldType(field) === "textarea"}
        <div style="margin-bottom: 1rem;">
          <TextArea
            labelText={field.label}
            name={field.name}
            bind:value={formData[field.name]}
            required={field.required}
            disabled={isSubmitting}
          />
        </div>
      {:else if getFieldType(field) === "select"}
        <div style="margin-bottom: 1rem;">
          <Select
            labelText={field.label}
            name={field.name}
            bind:selected={formData[field.name]}
            required={field.required}
            disabled={isSubmitting}
          >
            {#if field.options}
              {#each field.options as option}
                <SelectItem value={option.value} text={option.label} />
              {/each}
            {/if}
          </Select>
        </div>
      {:else if getFieldType(field) === "multiselect"}
        <div style="margin-bottom: 1rem;">
          <MultiSelect
            titleText={field.label}
            label={`Select ${field.label.toLowerCase()}`}
            filterable
            items={(field.options || []).map(opt => ({ id: opt.value, text: opt.label }))}
            bind:selectedIds={formData[field.name]}
            disabled={isSubmitting}
          />
          <input
            type="hidden"
            name={field.name}
            value={JSON.stringify(formData[field.name])}
          />
        </div>
      {:else if getFieldType(field) === "combobox"}
        <div style="margin-bottom: 1rem;">
          <ComboBox
            titleText={field.label}
            placeholder={`Select ${field.label.toLowerCase()}`}
            items={(field.options || []).map(opt => ({ id: opt.value, text: opt.label }))}
            bind:selectedId={formData[field.name]}
            shouldFilterItem={shouldFilterItem}
            disabled={isSubmitting}
          />
          <input
            type="hidden"
            name={field.name}
            value={formData[field.name] || ''}
          />
        </div>
      {/if}
    {/each}
  </form>
</Modal>