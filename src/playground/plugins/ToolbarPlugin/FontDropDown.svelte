<script context="module" lang="ts">
  import * as lexical from "lexical";
  import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from "react";
  import Button from "../../ui/Button.svelte";
  import DialogActions from "../../ui/DialogActions.svelte";
  import TextInput from "@ui/TextInput.svelte";
  import { INSERT_TABLE_COMMAND } from "@lexical/table";
  import DropDown from "@ui/Dropdown/DropDown.svelte";
  import * as Selection from "@lexical/selection";
  import { HeadingTagType } from "@lexical/rich-text";
  import * as RichText from "@lexical/rich-text";
  import * as Code from "@lexical/code";
  import {
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
  } from "@lexical/list";
  import { DropDownItem } from "@ui/index";
  import Select from "@ui/Select.svelte";
  import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS } from ".";
  export const blockTypeToBlockName = {
    bullet: "Bulleted List",
    check: "Check List",
    code: "Code Block",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
    number: "Numbered List",
    paragraph: "Normal",
    quote: "Quote",
  };

  export const rootTypeToRootName = {
    root: "Root",
    table: "Table",
  };
  export function dropDownActiveClass(active: boolean) {
    if (active) return "active dropdown-item-active";
    else return "";
  }
</script>

<script lang="ts">
  let {
    editor,
    value,
    style,
    disabled = false,
  } = $props<{
    editor: lexical.LexicalEditor;
    value: string;
    style: string;
    disabled?: boolean;
  }>();
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = lexical.$getSelection();
        if (
          lexical.$isRangeSelection(selection) ||
          lexical.DEPRECATED_$isGridSelection(selection)
        ) {
          Selection.$patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style]
  );

  const buttonAriaLabel =
    style === "font-family"
      ? "Formatting options for font family"
      : "Formatting options for font size";
</script>

<DropDown
  {disabled}
  buttonClassName={`toolbar-item ${style}`}
  buttonLabel={value}
  {buttonAriaLabel}
>
  {#if style === "font-family"}
    {#each FONT_FAMILY_OPTIONS as [option, text] (option)}
      <DropDownItem
        class={`item ${dropDownActiveClass(value === option)}`}
        onClick={() => handleClick(option)}
      >
        <span class="text">{text}</span>
      </DropDownItem>
    {/each}
  {:else if style === "font-size"}
    {#each FONT_SIZE_OPTIONS as [option, text] (option)}
      <DropDownItem
        class={`item ${dropDownActiveClass(value === option)} fontsize-item`}
        onClick={() => handleClick(option)}
      >
        <span class="text">{text}</span>
      </DropDownItem>
    {/each}
  {/if}
</DropDown>
