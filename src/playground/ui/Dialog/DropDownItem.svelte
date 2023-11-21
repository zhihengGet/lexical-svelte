<script>
  import * as React from "react";
  import {
   
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from "react";
  import { getContext, setContext } from "svelte";

  let { className, onClick, title } = $props();
  const ref = useRef(null);

  const dropDownContext =   getContext("dialog");
  if (dropDownContext === null) {
    throw new Error("DropDownItem must be used within a DropDown");
  }
</script>

<button class={className} class={onClick} bind:this={ref.current} {title} type="button">
  <slot/>
</button>
