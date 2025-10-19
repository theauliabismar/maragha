<script lang="ts">
  import { Grid, Column } from 'carbon-components-svelte';
  export let data;
</script>

<h1>My Bookshelf</h1>

<Grid>
  {#each data.books as book}
    <Column>
      <a href="/book/{book.id}">
        <h2>{book.title}</h2>
        <p>by {book.author}</p>
        <p>{book.category}</p>
      </a>
    </Column>
  {:else}
    <p>You have no books in your bookshelf.</p>
  {/each}
</Grid>
