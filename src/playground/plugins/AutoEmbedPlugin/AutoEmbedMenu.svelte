<script>
  import AutoEmbedMenuItem from "./AutoEmbedMenuItem.svelte"; // Adjust the import path as needed

  let { options, selectedItemIndex, onOptionClick, onOptionMouseEnter } =
    $props();
</script>

<div class="typeahead-popover">
  <ul>
    {#each options as option, i (option.key)}
      <AutoEmbedMenuItem
        index={i}
        isSelected={selectedItemIndex === i}
        on:click={() => onOptionClick(option, i)}
        on:mouseenter={() => onOptionMouseEnter(i)}
        key={option.key}
        {option}
      />
    {/each}
  </ul>
</div>
