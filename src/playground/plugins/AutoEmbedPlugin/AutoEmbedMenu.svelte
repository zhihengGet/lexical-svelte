<script lang="ts">
  import AutoEmbedMenuItem from "./AutoEmbedMenuItem.svelte"; // Adjust the import path as needed
  import type {
    AutoEmbedOption} from "@lexical/react/LexicalAutoEmbedPlugin.svelte";
import {
    EmbedConfig,
    EmbedMatchResult,
    URL_MATCHER,
  } from "@lexical/react/LexicalAutoEmbedPlugin.svelte";
  type t = {
    selectedItemIndex: number | null;
    onOptionClick: (option: AutoEmbedOption, index: number) => void;
    onOptionMouseEnter: (index: number) => void;
    options: Array<AutoEmbedOption>;
  };
  let { options, selectedItemIndex, onOptionClick, onOptionMouseEnter } =
    $props<t>();
</script>

<div class="typeahead-popover">
  <ul>
    {#each options as option, i (option.key)}
      <AutoEmbedMenuItem
        index={i}
        isSelected={selectedItemIndex === i}
        onClick={() => onOptionClick(option, i)}
        onMouseEnter={() => onOptionMouseEnter(i)}
        {option}
      />
    {/each}
  </ul>
</div>
