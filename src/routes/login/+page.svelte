<script lang="ts">
  import {
    Button,
    Form,
    FormGroup,
    TextInput,
    InlineNotification
  } from 'carbon-components-svelte';

  export let data;

  // --- Start of new code ---
  // Create variables to hold the input values
  let email = '';
  let password = '';

  // This reactive variable will be true if either field is empty
  $: isDisabled = !email || !password;
  // --- End of new code ---

  // A map of Auth.js error codes to user-friendly messages
  const errorMessages = {
    CredentialsSignin: 'Invalid email or password. Please try again.',
    EmailSignin: 'Failed to send the sign-in email. Please try again later.',
    OAuthAccountNotLinked:
      'This account is not linked to your email. Please sign in with the method you used originally.',
    AccessDenied: 'You are not authorized to access this page.',
    Verification: 'The verification link is invalid or has expired. Please try signing in again.',
    Default: 'An unknown error occurred. Please try again.'
  };

  $: errorMessage = errorMessages[data.error as keyof typeof errorMessages] || errorMessages.Default;
</script>

{#if data.error}
  <InlineNotification
    kind="error"
    title="Login Failed"
    subtitle={errorMessage}
    style="margin-bottom: 1rem;"
  />
{/if}

<Form method="POST" action="/auth/callback/credentials">
  <FormGroup>
    <TextInput labelText="Email" name="email" bind:value={email} />
  </FormGroup>
  <FormGroup>
    <TextInput type="password" labelText="Password" name="password" bind:value={password} />
  </FormGroup>
  <Button type="submit" disabled={isDisabled}>Log in</Button>
</Form>