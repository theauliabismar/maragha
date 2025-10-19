<script lang="ts">
  import {
    Button,
    Form,
    FormGroup,
    TextInput,
    InlineNotification
  } from 'carbon-components-svelte';
  import { signIn } from '@auth/sveltekit/client';

  export let data;

  let email = '';
  let password = '';
  let isLoading = false;
  let errorMessage = '';

  $: isDisabled = !email || !password || isLoading;

  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password. Please try again.',
    EmailSignin: 'Failed to send the sign-in email. Please try again later.',
    OAuthAccountNotLinked: 'This account is not linked to your email. Please sign in with the method you used originally.',
    AccessDenied: 'You are not authorized to access this page.',
    Verification: 'The verification link is invalid or has expired. Please try signing in again.',
    Default: 'An unknown error occurred. Please try again.'
  };

  $: if (data.error) {
    errorMessage = errorMessages[data.error] || errorMessages.Default;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isLoading = true;
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/admin/manage/authors'
      });

    } catch (error) {
      console.error('Sign in error:', error);
      isLoading = false;
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

<Form on:submit={handleSubmit}>
  <FormGroup>
    <TextInput 
      labelText="Email" 
      name="email" 
      type="email"
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