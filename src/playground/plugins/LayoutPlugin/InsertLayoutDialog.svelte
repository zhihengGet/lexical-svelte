<script context="module" lang="ts">
  import type { LexicalEditor } from "lexical";
  import * as React from "react";
  import { useState } from "react";

  import Button from "@ui/Button.svelte";

  import { INSERT_LAYOUT_COMMAND } from "./LayoutPlugin";
  import DropDown from "@ui/Dropdown/DropDown.svelte";
  import DropDownItem from "@ui/Dropdown/DropDownItem.svelte";

  const LAYOUTS = [
    { label: "2 columns (equal width)", value: "1fr 1fr" },
    { label: "2 columns (25% - 75%)", value: "1fr 3fr" },
    { label: "3 columns (equal width)", value: "1fr 1fr 1fr" },
    { label: "3 columns (25% - 50% - 25%)", value: "1fr 2fr 1fr" },
    { label: "4 columns (equal width)", value: "1fr 1fr 1fr 1fr" },
  ];
</script>

<script lang="ts">
  type props = {
    activeEditor: LexicalEditor;
    onClose: () => void;
  };
  let { activeEditor, onClose } = $props<props>();

  const [layout, setLayout] = useState(LAYOUTS[0].value);
  const buttonLabel = LAYOUTS.find((item) => item.value === layout)?.label;

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, layout);
    onClose();
  };
</script>

<DropDown buttonClassName="toolbar-item dialog-dropdown" {buttonLabel}>
  {#each LAYOUTS as { label, value } (value)}
    <DropDownItem class="item" onClick={() => setLayout(value)}>
      <span class="text">{label}</span>
    </DropDownItem>
  {/each}
</DropDown>
<Button {onClick}>Insert</Button>
