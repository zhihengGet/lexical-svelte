<script context="module" lang="ts">
  // your script goes here
</script>

<script lang="ts">
  import {
    $createCodeNode as createCodeNode,
    $isCodeNode as isCodeNode,
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    CODE_LANGUAGE_MAP,
    getLanguageFriendlyName,
  } from "@lexical/code";
  import { TOGGLE_LINK_COMMAND } from "@lexical/link";
  import {
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    ListNode,
    REMOVE_LIST_COMMAND,
  } from "@lexical/list";
  import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin.svelte";
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import { isDecoratorBlockNode } from "@lexical/react/nodes/LexicalDecoratorBlockNode";
  import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
  import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    $isQuoteNode,
    HeadingTagType,
  } from "@lexical/rich-text";
  import {
    $getSelectionStyleValueForProperty,
    $isParentElementRTL,
    $patchStyleText,
    $setBlocksType,
  } from "@lexical/selection";
  import { $isTableNode } from "@lexical/table";
  import {
    $findMatchingParent,
    $getNearestBlockElementAncestorOrThrow,
    $getNearestNodeOfType,
    mergeRegister,
  } from "@lexical/utils";
  import {
    $createParagraphNode,
    $getNodeByKey,
    $getRoot,
    $getSelection,
    $isElementNode,
    $isRangeSelection,
    $isRootOrShadowRoot,
    $isTextNode,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    COMMAND_PRIORITY_NORMAL,
    DEPRECATED_$isGridSelection,
    ElementFormatType,
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
  import { useCallback, useEffect, useState } from "react";
  import * as React from "react";
  import { IS_APPLE } from "shared/environment";

  import useModal from "../../hooks/useModal";
  import catTypingGif from "../../images/cat-typing.gif";
  import { $createStickyNode } from "../../nodes/StickyNode/StickyNode";
  import DropDown from "../../ui/Dropdown/DropDown.svelte";
  import DropDownItem from "../../ui/Dropdown/DropDownItem.svelte";
  import DropdownColorPicker from "../../ui/DropdownColorPicker.svelte";
  import { getSelectedNode } from "../../utils/getSelectedNode";
  import { sanitizeUrl } from "../../utils/url";
  import { EmbedConfigs } from "../AutoEmbedPlugin/index";
  import { INSERT_COLLAPSIBLE_COMMAND } from "../CollapsiblePlugin";
  import { InsertEquationDialog } from "../EquationsPlugin";
  // import { INSERT_EXCALIDRAW_COMMAND } from "../ExcalidrawPlugin";
  import {
    INSERT_IMAGE_COMMAND,
    InsertImageDialog,
    InsertImagePayload,
  } from "../ImagesPlugin/index";
  import { InsertInlineImageDialog } from "../InlineImagePlugin";
  import InsertLayoutDialog from "../LayoutPlugin/InsertLayoutDialog";
  import { INSERT_PAGE_BREAK } from "../PageBreakPlugin";
  import { InsertPollDialog } from "../PollPlugin";
  import { InsertNewTableDialog, InsertTableDialog } from "../TablePlugin";

  const blockTypeToBlockName = {
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

  const rootTypeToRootName = {
    root: "Root",
    table: "Table",
  };

  function getCodeLanguageOptions(): [string, string][] {
    const options: [string, string][] = [];

    for (const [lang, friendlyName] of Object.entries(
      CODE_LANGUAGE_FRIENDLY_NAME_MAP
    )) {
      options.push([lang, friendlyName]);
    }

    return options;
  }

  const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

  const FONT_FAMILY_OPTIONS: [string, string][] = [
    ["Arial", "Arial"],
    ["Courier New", "Courier New"],
    ["Georgia", "Georgia"],
    ["Times New Roman", "Times New Roman"],
    ["Trebuchet MS", "Trebuchet MS"],
    ["Verdana", "Verdana"],
  ];

  const FONT_SIZE_OPTIONS: [string, string][] = [
    ["10px", "10px"],
    ["11px", "11px"],
    ["12px", "12px"],
    ["13px", "13px"],
    ["14px", "14px"],
    ["15px", "15px"],
    ["16px", "16px"],
    ["17px", "17px"],
    ["18px", "18px"],
    ["19px", "19px"],
    ["20px", "20px"],
  ];

  const ELEMENT_FORMAT_OPTIONS: {
    [key in Exclude<ElementFormatType, "">]: {
      icon: string;
      iconRTL: string;
      name: string;
    };
  } = {
    center: {
      icon: "center-align",
      iconRTL: "center-align",
      name: "Center Align",
    },
    end: {
      icon: "right-align",
      iconRTL: "left-align",
      name: "End Align",
    },
    justify: {
      icon: "justify-align",
      iconRTL: "justify-align",
      name: "Justify Align",
    },
    left: {
      icon: "left-align",
      iconRTL: "left-align",
      name: "Left Align",
    },
    right: {
      icon: "right-align",
      iconRTL: "left-align",
      name: "Right Align",
    },
    start: {
      icon: "left-align",
      iconRTL: "right-align",
      name: "Start Align",
    },
  };

  function dropDownActiveClass(active: boolean) {
    if (active) return "active dropdown-item-active";
    else return "";
  }
</script>
