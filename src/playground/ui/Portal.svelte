<script lang="ts">
  import { SvelteRender } from "@lexical/react/types";
  import { usePortal } from "@melt-ui/svelte/internal/actions";
  import {
    effect,
    getPortalDestination,
  } from "@melt-ui/svelte/internal/helpers";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  let { snippet, children, portal, ...props } = $props<
    SvelteRender & { portal: boolean }
  >();


  function refFn(node: HTMLElement) {
    if (portal == false) return;
    let portal = usePortal(node, props.target);

    onDestroy(() => {
      if (portal && portal.destroy) {
        portal.destroy();
      }
    });
  }
</script>

{#await props.component}
    <div>wait</div>  
{:then component} 
{#if props.component}

  {@const components= [props.component].flat()}
  {#each components as component}

  <svelte:component
    this={component}
    {...props}
    bind:this={props.ref.current}
  >
    {#if props.childComponents}
      <svelte:component this={props.childComponents.component} />
    {/if}

    {#if props.childSnippet}
    {@render children()}
     {/if}
  
  </svelte:component>
  {/each}
  {:else if snippet} 
   {@render snippet({children,refFn,...props })} 
{/if}
{/await}