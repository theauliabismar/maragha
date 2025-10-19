<script lang="ts">
  import { Grid, Row, Column, Button, Slider } from 'carbon-components-svelte';
  import { Bookmark } from 'carbon-icons-svelte';
  export let data;

  let inBookshelf = data.inBookshelf;
  let progress = data.progress ?? 0;

  async function toggleBookshelf() {
    const method = inBookshelf ? 'DELETE' : 'POST';
    await fetch('/my-bookshelf/api', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: data.book.id }),
    });
    inBookshelf = !inBookshelf;
  }

  async function updateProgress(value: number) {
    progress = value;
    await fetch('/my-bookshelf/progress/api', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: data.book.id, progress }),
    });
  }
</script>

<h1>{data.book.title}</h1>

<Button icon={Bookmark} on:click={toggleBookshelf}>
  {inBookshelf ? 'Remove from Bookshelf' : 'Add to Bookshelf'}
</Button>

{#if inBookshelf}
  <Slider
    labelText="Reading Progress"
    max={data.pages.length}
    value={progress}
    on:change={(e) => updateProgress(e.detail.value)}
  />
{/if}

<Grid>
  {#each data.pages as page}
    <Row>
      <Column>
        <h3>Page {page.pageNumber}</h3>
        <h4>Original Text</h4>
        <p>{page.tulisan}</p>
      </Column>
      <Column>
        <h3 class="visually-hidden">Translation</h3>
        <h4>Translation</h4>
        <p>{page.terjemah}</p>
      </Column>
    </Row>
  {/each}
</Grid>
