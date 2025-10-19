<script lang="ts">
	import { Button, Form, FormGroup, TextInput } from 'carbon-components-svelte';
	import { signIn } from '@auth/sveltekit/client';
</script>

<Form on:submit={() => signIn('credentials')}>
	<FormGroup>
		<TextInput labelText="Email" name="email" />
	</FormGroup>
	<FormGroup>
		<TextInput type="password" labelText="Password" name="password" />
	</FormGroup>
	<Button type="submit">Log in</Button>
</Form>
