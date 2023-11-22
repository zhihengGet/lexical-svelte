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
  import {
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
  import {
    $isTableNode as isTableNode,
    INSERT_TABLE_COMMAND,
  } from "@lexical/table";
  import DropDown from "@ui/Dropdown/DropDown.svelte";
  import * as Selection from "@lexical/selection";
  import { HeadingTagType } from "@lexical/rich-text";
  import * as RichText from "@lexical/rich-text";
  import * as Code from "@lexical/code";
  import {
    CODE_LANGUAGE_MAP,
    getLanguageFriendlyName,
    CODE_LANGUAGE_OPTIONS,
  } from "@lexical/code";
  import * as utils from "@lexical/utils";
  import {
    $isListNode as isListNode,
    ListNode,
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
  } from "@lexical/list";
  import { DropDownItem } from "@ui/index";
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import { $findMatchingParent as findMatchingParent } from "lexical/LexicalUtils";
  import useModal from "../../hooks/useModal";
  import * as lexicalLink from "@lexical/link";
  import { TOGGLE_LINK_COMMAND } from "@lexical/link";
  import { sanitizeUrl } from "../../utils/url";
  import {
    INSERT_IMAGE_COMMAND,
    InsertImageDialog,
    InsertImagePayload,
  } from "../ImagesPlugin";
  import { isDecoratorBlockNode } from "@lexical/react/nodes/LexicalDecoratorBlockNode";
  import { IS_APPLE } from "shared/environment";
  import FontDropDown from "./FontDropDown.svelte";
  import BlockFormatDropdown from "./BlockFormatDropdown.svelte";
  import ElementFormatDropdown from "./ElementFormatDropdown.svelte";
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
  let { setIsLinkEditMode } = $props<{
    setIsLinkEditMode: React.Dispatch<boolean>;
  }>();
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>("root");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontColor, setFontColor] = useState<string>("#000");
  const [bgColor, setBgColor] = useState<string>("#fff");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [modal, showModal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const $updateToolbar = useCallback(() => {
    const selection = lexical.$getSelection();
    if (lexical.$isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && lexical.$isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor().getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if (lexicalLink.$isLinkNode(parent) || lexicalLink.$isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = findMatchingParent(node, isTableNode);
      if (isTableNode(tableNode)) {
        setRootType("table");
      } else {
        setRootType("root");
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if (isListNode(element)) {
          const parentList = utils.$getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = RichText.$isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if (Code.$isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof Code.CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? Code.CODE_LANGUAGE_MAP[language] || language : ""
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        Selection.$getSelectionStyleValueForProperty(
          selection,
          "font-size",
          "15px"
        )
      );
      setFontColor(
        Selection.$getSelectionStyleValueForProperty(selection, "color", "#000")
      );
      setBgColor(
        Selection.$getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff"
        )
      );
      setFontFamily(
        Selection.$getSelectionStyleValueForProperty(
          selection,
          "font-family",
          "Arial"
        )
      );
      let matchingParent;
      if (lexicalLink.$isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = findMatchingParent(
          node,
          (parentNode) =>
            lexical.$isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        lexical.$isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : lexical.$isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || "left"
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      lexical.SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      lexical.COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return utils.mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor().registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor().registerCommand<boolean>(
        lexical.CAN_REDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        lexical.COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor().registerCommand<boolean>(
        lexical.CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        lexical.COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    return activeEditor().registerCommand(
      lexical.KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault();
          if (!isLink) {
            setIsLinkEditMode(true);
          } else {
            setIsLinkEditMode(false);
          }
          return activeEditor().dispatchCommand(
            TOGGLE_LINK_COMMAND,
            sanitizeUrl("https://")
          );
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor().update(() => {
        const selection = lexical.$getSelection();
        if (
          lexical.$isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          Selection.$patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor]
  );

  const clearFormatting = useCallback(() => {
    activeEditor().update(() => {
      const selection = lexical.$getSelection();
      if (lexical.$isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if (lexical.$isTextNode(node)) {
            if (idx === 0 && anchor.offset !== 0) {
              node = node.splitText(anchor.offset)[1] || node;
            }
            if (idx === nodes.length - 1) {
              node = node.splitText(focus.offset)[0] || node;
            }

            if (node.__style !== "") {
              node.setStyle("");
            }
            if (node.__format !== 0) {
              node.setFormat(0);
              utils.$getNearestBlockElementAncestorOrThrow(node).setFormat("");
            }
          } else if (
            RichText.$isHeadingNode(node) ||
            RichText.$isQuoteNode(node)
          ) {
            node.replace(lexical.$createParagraphNode(), true);
          } else if (isDecoratorBlockNode(node)) {
            node.setFormat("");
          }
        });
      }
    });
  }, [activeEditor]);

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText]
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ "background-color": value });
    },
    [applyStyleText]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor().update(() => {
        if (selectedElementKey() !== null) {
          const node = lexical.$getNodeByKey(selectedElementKey());
          if (Code.$isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );
  const insertGifOnClick = (payload: InsertImagePayload) => {
    activeEditor().dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };
</script>

<!-- Import statements for components and stylesheets -->

<div class="toolbar">
  <button
    disabled={!canUndo || !isEditable}
    onClick={() => {
      activeEditor().dispatchCommand(UNDO_COMMAND, undefined);
    }}
    title={IS_APPLE ? "Undo (⌘Z)" : "Undo (Ctrl+Z)"}
    type="button"
    class="toolbar-item spaced"
    aria-label="Undo"
  >
    <i class="format undo" />
  </button>
  <button
    disabled={!canRedo || !isEditable}
    onClick={() => {
      activeEditor().dispatchCommand(REDO_COMMAND, undefined);
    }}
    title={IS_APPLE ? "Redo (⌘Y)" : "Redo (Ctrl+Y)"}
    type="button"
    class="toolbar-item"
    aria-label="Redo"
  >
    <i class="format redo" />
  </button>

  {#if blockType() in blockTypeToBlockName && activeEditor() === editor}
    <BlockFormatDropdown
      disabled={!isEditable}
      blockType={blockType()}
      rootType={rootType()}
      {editor}
    />
  {/if}

  {#if blockType() === "code"}
    <DropDown
      disabled={!isEditable}
      buttonClassName="toolbar-item code-language"
      buttonLabel={getLanguageFriendlyName(codeLanguage())}
      buttonAriaLabel="Select language"
    >
      {#each CODE_LANGUAGE_OPTIONS as [value, name] (value)}
        <DropDownItem
          class={`item ${dropDownActiveClass(value === codeLanguage())}`}
          onClick={() => onCodeLanguageSelect(value)}
        >
          <span class="text">{name}</span>
        </DropDownItem>
      {/each}
    </DropDown>
  {:else}
    <FontDropDown
      disabled={!isEditable}
      style={"font-family"}
      value={fontFamily()}
      {editor}
    />
    <FontDropDown
      disabled={!isEditable}
      style={"font-size"}
      value={fontSize()}
      {editor}
    />

    <!-- Add other buttons and dropdowns as needed -->
  {/if}

  <ElementFormatDropdown
    disabled={!isEditable}
    value={elementFormat()}
    {editor}
    isRTL={isRTL()}
  />

  {modal}
</div>
