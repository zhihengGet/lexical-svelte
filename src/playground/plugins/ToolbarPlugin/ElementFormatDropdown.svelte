<script context="module" lang="ts">
  import type * as lexical from "lexical";
  import {
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    INDENT_CONTENT_COMMAND,
    KEY_MODIFIER_COMMAND,
    LexicalEditor,
    NodeKey,
    OUTDENT_CONTENT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
  } from "lexical";
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
  import {
    ELEMENT_FORMAT_OPTIONS,
    FONT_FAMILY_OPTIONS,
    FONT_SIZE_OPTIONS,
  } from ".";
  import Divider from "./Divider.svelte";
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
    isRTL,
    disabled = false,
  } = $props<{
    editor: lexical.LexicalEditor;
    value: lexical.ElementFormatType;
    isRTL: boolean;
    disabled: boolean;
  }>();
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || "left"];
</script>

<DropDown
  {disabled}
  buttonLabel={formatOption.name}
  buttonIconClassName={`icon ${
    isRTL ? formatOption.iconRTL : formatOption.icon
  }`}
  buttonClassName="toolbar-item spaced alignment"
  buttonAriaLabel="Formatting options for text alignment"
>
  <DropDownItem
    onClick={() => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
    }}
    class="item"
  >
    <i class="icon left-align" />
    <span class="text">Left Align</span>
  </DropDownItem>
  <DropDownItem
    onClick={() => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
    }}
    class="item"
  >
    <i class="icon center-align" />
    <span class="text">Center Align</span>
  </DropDownItem>
  <DropDownItem
    onClick={() => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
    }}
    class="item"
  >
    <i class="icon right-align" />
    <span class="text">Right Align</span>
  </DropDownItem>
  <DropDownItem
    onClick={() => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
    }}
    class="item"
  >
    <i class="icon justify-align" />
    <span class="text">Justify Align</span>
  </DropDownItem>
  <DropDownItem
    onClick={() => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "start");
    }}
    class="item"
  >
    <i
      class={`icon ${
        isRTL
          ? ELEMENT_FORMAT_OPTIONS.start.iconRTL
          : ELEMENT_FORMAT_OPTIONS.start.icon
      }`}
    />
    <span class="text">Start Align</span>
  </DropDownItem>
  <DropDownItem
    onClick={() => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "end");
    }}
    class="item"
  >
    <i
      class={`icon ${
        isRTL
          ? ELEMENT_FORMAT_OPTIONS.end.iconRTL
          : ELEMENT_FORMAT_OPTIONS.end.icon
      }`}
    />
    <span class="text">End Align</span>
  </DropDownItem>
  <Divider />
  <DropDownItem
    onClick={() => {
      editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
    }}
    class="item"
  >
    <i class={"icon " + (isRTL ? "indent" : "outdent")} />
    <span class="text">Outdent</span>
  </DropDownItem>
  <DropDownItem
    onClick={() => {
      editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
    }}
    class="item"
  >
    <i class={"icon " + (isRTL ? "outdent" : "indent")} />
    <span class="text">Indent</span>
  </DropDownItem>
</DropDown>
