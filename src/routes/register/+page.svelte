<script lang="ts">
	import { Button, Form, FormGroup, TextInput } from 'carbon-components-svelte';
</script>

<Form method="POST">
	<FormGroup>
		<TextInput labelText="Name" name="name" />
	</FormGroup>
	<FormGroup>
		<TextInput labelText="Email" name="email" />
	</FormGroup>
	<FormGroup>
		<TextInput type="password" labelText="Password" name="password" />
	</FormGroup>
	<Button type="submit">Register</Button>
</Form>
