<script lang="ts">
  import { SvelteRender } from "@lexical/react/types";
  import { usePortal } from "@melt-ui/svelte/internal/actions";
  import {
    effect,
    getPortalDestination,
  } from "@melt-ui/svelte/internal/helpers";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  let { snippet,children, ...props } = $props<SvelteRender>();

  function refFn(node: HTMLElement) {
    let portal = usePortal(node, props.target);

    onDestroy(() => {
      if (portal && portal.destroy) {
        portal.destroy();
      }
    });
  }
</script>
{#if props.component}

  <svelte:component
    this={props.component}
    {...props}
    bind:this={props.ref.current}
  >
 
   {@render children()}
  </svelte:component>

  {:else if snippet} 
   {@render snippet({children,refFn,...props })}
{/if}
