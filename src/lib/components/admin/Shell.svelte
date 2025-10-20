<script lang="ts">
  import {
    Header,
    HeaderUtilities,
    HeaderAction,
    HeaderPanelLinks,
    HeaderPanelLink,
    HeaderGlobalAction,
    Content,
    HeaderPanelDivider,
  } from 'carbon-components-svelte';
  import { Logout, Menu } from 'carbon-icons-svelte';
  import { expoIn } from "svelte/easing";

  export let title: string;

  let isOpen = false;
  const transitions = {
    "0": { text: "Default (duration: 200ms)", value: { duration: 200 } },
    "1": {
      text: "Custom (duration: 600ms, delay: 50ms, easing: expoIn)",
      value: { duration: 600, delay: 50, easing: expoIn },
    },
    "2": { text: "Disabled", value: false },
  } as const;

  let selected: keyof typeof transitions = "0";
</script>

<Header company="Maragha" platformName={title}>
  <HeaderUtilities>
    <HeaderAction bind:isOpen transition={transitions[selected].value}>
      <HeaderPanelLinks>
        <HeaderPanelLink on:click={() => (isOpen = false)} href="/admin/manage/books">Buku</HeaderPanelLink>
        <HeaderPanelLink on:click={() => (isOpen = false)} href="/admin/manage/pages">Halaman</HeaderPanelLink>
        <HeaderPanelDivider />
        <HeaderPanelLink on:click={() => (isOpen = false)} href="/admin/manage/authors">Penulis</HeaderPanelLink>
        <HeaderPanelLink on:click={() => (isOpen = false)} href="/admin/manage/categories">Ketegori</HeaderPanelLink>
        <HeaderPanelLink on:click={() => (isOpen = false)} href="/admin/manage/publishers">Penerbit</HeaderPanelLink>
        <HeaderPanelDivider />
        <HeaderPanelLink on:click={() => (isOpen = false)} href="/admin/users">Pengguna</HeaderPanelLink>
        <HeaderPanelLink on:click={() => (isOpen = false)} href="/admin/roles">Jabatan</HeaderPanelLink>
        <HeaderPanelLink on:click={() => (isOpen = false)} href="/admin/permissions">Hak</HeaderPanelLink>
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>

  <form method="POST" action="/auth/signout">
    <HeaderGlobalAction
      icon={Logout}
      iconDescription="Log out"
      tooltipPosition="left"
      type="submit"
    />
  </form>
</Header>

<Content id="main-content">
  <slot />
</Content>