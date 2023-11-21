<script lang="ts">
  import { AutoEmbedOption } from "@lexical/react/LexicalAutoEmbedPlugin.svelte";

  type prop = {
    index: number;
    isSelected: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    option: AutoEmbedOption;
  };
  let { index, isSelected, onClick, onMouseEnter, option } = $props<prop>();
  let className = "item";
  if (isSelected) {
    className += " selected";
  }
  let ref = option.setRefElement;
</script>

<li
  tabIndex={-1}
  class={className}
  use:ref
  role="option"
  aria-selected={isSelected}
  id={"typeahead-item-" + index}
  onmouseenter={onMouseEnter}
  onclick={onClick}
>
  <span class="text">{option.title}</span>
</li>
