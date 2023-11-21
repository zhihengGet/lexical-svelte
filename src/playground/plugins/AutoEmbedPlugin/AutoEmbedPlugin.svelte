<script lang="ts">
  import { AutoEmbedOption } from "@lexical/react/LexicalAutoEmbedPlugin.svelte";

  type prop = {
    index: number;
    isSelected: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    option: AutoEmbedOption;
  };
  let { index, isSelected, onClick, onMouseEnter } = $props<prop>();
  let className = "item";
  if (isSelected) {
    className += " selected";
  }
</script>

<li
  key={option.key}
  tabIndex={-1}
  class={className}
  ref={option.setRefElement}
  role="option"
  aria-selected={isSelected}
  id={"typeahead-item-" + index}
  {onMouseEnter}
  {onClick}
>
  <span class="text">{option.title}</span>
</li>
