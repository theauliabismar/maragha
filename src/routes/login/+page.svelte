<script lang="ts">
  import {
    Button,
    Form,
    FormGroup,
    TextInput,
    InlineNotification
  } from 'carbon-components-svelte';
  import { goto } from '$app/navigation';
  import { signIn } from '@auth/sveltekit/client';

  export let data;

  let email = '';
  let password = '';
  let isLoading = false;

  $: isDisabled = !email || !password || isLoading;

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

  async function handleSubmit() {
    isLoading = true;
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (result?.ok) {
      // Redirect to admin on success
      await goto('/admin');
    } else {
      isLoading = false;
      // Error will be shown via data.error
    }
  }
</script>

{#if data.error}
  <InlineNotification
    kind="error"
    title="Login Failed"
    subtitle={errorMessage}
    style="margin-bottom: 1rem;"
  />
{/if}

<Form on:submit={(e) => {handleSubmit(); e.preventDefault();}}>
  <FormGroup>
    <TextInput 
      labelText="Email" 
      name="email" 
      bind:value={email}
      disabled={isLoading}
    />
  </FormGroup>
  <FormGroup>
    <TextInput 
      type="password" 
      labelText="Password" 
      name="password" 
      bind:value={password}
      disabled={isLoading}
    />
  </FormGroup>
  <Button type="submit" disabled={isDisabled}>
    {isLoading ? 'Logging in...' : 'Log in'}
  </Button>
</Form>