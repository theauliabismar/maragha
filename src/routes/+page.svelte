<script lang="ts">
  import {
    TextInput,
    Select,
    SelectItem,
    Button,
    Grid,
    Row,
    Column,
  } from 'carbon-components-svelte';
  import { Search } from 'carbon-icons-svelte';
  export let data;

  let query = data.query;
  let selectedAuthor = data.selectedAuthor;
  let selectedCategory = data.selectedCategory;
</script>

<h1>Book Catalog</h1>

<form method="GET">
  <Grid>
    <Row>
      <Column>
        <TextInput labelText="Search" name="q" bind:value={query} />
      </Column>
      <Column>
        <Select labelText="Author" name="author" bind:selected={selectedAuthor}>
          <SelectItem value="" text="All Authors" />
          {#each data.authors as author}
            <SelectItem value={author.id} text={author.name} />
          {/each}
        </Select>
      </Column>
      <Column>
        <Select labelText="Category" name="category" bind:selected={selectedCategory}>
          <SelectItem value="" text="All Categories" />
          {#each data.categories as category}
            <SelectItem value={category.name} text={category.name} />
          {/each}
        </Select>
      </Column>
      <Column>
        <Button type="submit" icon={Search}>Search</Button>
      </Column>
    </Row>
  </Grid>
</form>

<Grid>
  {#each data.books as book}
    <Column>
      <a href="/book/{book.id}">
        <h2>{book.title}</h2>
        <p>by {book.author}</p>
        <p>{book.category}</p>
      </a>
    </Column>
  {/each}
</Grid>
