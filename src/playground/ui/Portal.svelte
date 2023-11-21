<script lang="ts">
  import { SvelteRender } from "@lexical/react/types";
  import { createEventDispatcher, onMount } from "svelte";

  let { ...props } = $props<SvelteRender>();
  const disptach = createEventDispatcher();
  onMount(() => {
    disptach("mount", {});
  });
  let component;
</script>

{#if props.component}
  <!-- content here -->
  <svelte:component
    this={props.component}
    {...props}
    bind:this={props.ref.current}
  >
    {props?.children}
  </svelte:component>
{/if}
