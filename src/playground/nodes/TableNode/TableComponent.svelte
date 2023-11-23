<script context="module" lang="ts">
  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  import type { RangeSelection, TextFormatType ,
    EditorThemeClasses,
    LexicalEditor} from "lexical";

  import {
    $generateJSONFromSelectedNodes as generateJSONFromSelectedNodes,
    $generateNodesFromSerializedNodes as generateNodesFromSerializedNodes,
    $insertGeneratedNodes as insertGeneratedNodes,
  } from "@lexical/clipboard";
  import {
    $generateHtmlFromNodes as generateHtmlFromNodes,
    $generateNodesFromDOM as generateNodesFromDOM,
  } from "@lexical/html";
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import LexicalNestedComposer from "@lexical/react/LexicalNestedComposer.svelte";
  import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection.svelte";
  import { mergeRegister } from "@lexical/utils";
  import {
    $addUpdateTag as addUpdateTag,
    $createParagraphNode as createParagraphNode,
    $createRangeSelection as createRangeSelection,
    $getNodeByKey as getNodeByKey,
    $getRoot as getRoot,
    $getSelection as getSelection,
    $isNodeSelection as isNodeSelection,
    $isRangeSelection as isRangeSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    COPY_COMMAND,
    createEditor,
    CUT_COMMAND,
    FORMAT_TEXT_COMMAND,
    KEY_ARROW_DOWN_COMMAND,
    KEY_ARROW_LEFT_COMMAND,
    KEY_ARROW_RIGHT_COMMAND,
    KEY_ARROW_UP_COMMAND,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    KEY_ENTER_COMMAND,
    KEY_ESCAPE_COMMAND,
    KEY_TAB_COMMAND,
    NodeKey,
    PASTE_COMMAND,
  } from "lexical";
  import { useCallback, useEffect, useMemo, useRef, useState } from "react";
  import * as React from "react";

  import { IS_APPLE } from "shared/environment";

  import { CellContext } from "../plugins/TablePlugin";
  import type {
    Rows,
    TableNode} from "./TableNode";
import {
    $isTableNode as isTableNode,
    Cell,
    cellHTMLCache,
    cellTextContentCache,
    createRow,
    createUID,
    exportTableCellsToHTML,
    extractRowsFromHTML
  } from "./TableNode";

  type SortOptions = { type: "ascending" | "descending"; x: number };

  const NO_CELLS: [] = [];

  function $createSelectAll(): RangeSelection {
    const sel = $createRangeSelection();
    sel.focus.set("root", $getRoot().getChildrenSize(), "element");
    return sel;
  }

  function createEmptyParagraphHTML(theme: EditorThemeClasses): string {
    return `<p class="${theme.paragraph}"><br></p>`;
  }

  function focusCell(tableElem: HTMLElement, id: string): void {
    const cellElem = tableElem.querySelector(`[data-id=${id}]`) as HTMLElement;
    if (cellElem == null) {
      return;
    }
    cellElem.focus();
  }

  function isStartingResize(target: HTMLElement): boolean {
    return target.nodeType === 1 && target.hasAttribute("data-table-resize");
  }

  function generateHTMLFromJSON(
    editorStateJSON: string,
    cellEditor: LexicalEditor
  ): string {
    const editorState = cellEditor.parseEditorState(editorStateJSON);
    let html = cellHTMLCache.get(editorStateJSON);
    if (html === undefined) {
      html = editorState.read(() => $generateHtmlFromNodes(cellEditor, null));
      const textContent = editorState.read(() => $getRoot().getTextContent());
      cellHTMLCache.set(editorStateJSON, html);
      cellTextContentCache.set(editorStateJSON, textContent);
    }
    return html;
  }

  function getCurrentDocument(editor: LexicalEditor): Document {
    const rootElement = editor.getRootElement();
    return rootElement !== null ? rootElement.ownerDocument : document;
  }

  function isCopy(
    keyCode: number,
    shiftKey: boolean,
    metaKey: boolean,
    ctrlKey: boolean
  ): boolean {
    if (shiftKey) {
      return false;
    }
    if (keyCode === 67) {
      return IS_APPLE ? metaKey : ctrlKey;
    }

    return false;
  }

  function isCut(
    keyCode: number,
    shiftKey: boolean,
    metaKey: boolean,
    ctrlKey: boolean
  ): boolean {
    if (shiftKey) {
      return false;
    }
    if (keyCode === 88) {
      return IS_APPLE ? metaKey : ctrlKey;
    }

    return false;
  }

  function isPaste(
    keyCode: number,
    shiftKey: boolean,
    metaKey: boolean,
    ctrlKey: boolean
  ): boolean {
    if (shiftKey) {
      return false;
    }
    if (keyCode === 86) {
      return IS_APPLE ? metaKey : ctrlKey;
    }

    return false;
  }

  function getCellID(domElement: HTMLElement): null | string {
    let node: null | HTMLElement = domElement;
    while (node !== null) {
      const possibleID = node.getAttribute("data-id");
      if (possibleID != null) {
        return possibleID;
      }
      node = node.parentElement;
    }
    return null;
  }

  function getTableCellWidth(domElement: HTMLElement): number {
    let node: null | HTMLElement = domElement;
    while (node !== null) {
      if (node.nodeName === "TH" || node.nodeName === "TD") {
        return node.getBoundingClientRect().width;
      }
      node = node.parentElement;
    }
    return 0;
  }

  function $updateCells(
    rows: Rows,
    ids: Array<string>,
    cellCoordMap: Map<string, [number, number]>,
    cellEditor: null | LexicalEditor,
    updateTableNode: (fn2: (tableNode: TableNode) => void) => void,
    fn: () => void
  ): void {
    for (const id of ids) {
      const cell = getCell(rows, id, cellCoordMap);
      if (cell !== null && cellEditor !== null) {
        const editorState = cellEditor.parseEditorState(cell.json);
        cellEditor._headless = true;
        cellEditor.setEditorState(editorState);
        cellEditor.update(fn, { discrete: true });
        cellEditor._headless = false;
        const newJSON = JSON.stringify(cellEditor.getEditorState());
        updateTableNode((tableNode) => {
          const [x, y] = cellCoordMap.get(id) as [number, number];
          $addUpdateTag("history-push");
          tableNode.updateCellJSON(x, y, newJSON);
        });
      }
    }
  }

  function isTargetOnPossibleUIControl(target: HTMLElement): boolean {
    let node: HTMLElement | null = target;
    while (node !== null) {
      const nodeName = node.nodeName;
      if (
        nodeName === "BUTTON" ||
        nodeName === "INPUT" ||
        nodeName === "TEXTAREA"
      ) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  function getSelectedRect(
    startID: string,
    endID: string,
    cellCoordMap: Map<string, [number, number]>
  ): null | { startX: number; endX: number; startY: number; endY: number } {
    const startCoords = cellCoordMap.get(startID);
    const endCoords = cellCoordMap.get(endID);
    if (startCoords === undefined || endCoords === undefined) {
      return null;
    }
    const startX = Math.min(startCoords[0], endCoords[0]);
    const endX = Math.max(startCoords[0], endCoords[0]);
    const startY = Math.min(startCoords[1], endCoords[1]);
    const endY = Math.max(startCoords[1], endCoords[1]);

    return {
      endX,
      endY,
      startX,
      startY,
    };
  }

  function getSelectedIDs(
    rows: Rows,
    startID: string,
    endID: string,
    cellCoordMap: Map<string, [number, number]>
  ): Array<string> {
    const rect = getSelectedRect(startID, endID, cellCoordMap);
    if (rect === null) {
      return [];
    }
    const { startX, endY, endX, startY } = rect;
    const ids = [];

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        ids.push(rows[y].cells[x].id);
      }
    }
    return ids;
  }

  function extractCellsFromRows(
    rows: Rows,
    rect: { startX: number; endX: number; startY: number; endY: number }
  ): Rows {
    const { startX, endY, endX, startY } = rect;
    const newRows: Rows = [];

    for (let y = startY; y <= endY; y++) {
      const row = rows[y];
      const newRow = createRow();
      for (let x = startX; x <= endX; x++) {
        const cellClone = { ...row.cells[x] };
        cellClone.id = createUID();
        newRow.cells.push(cellClone);
      }
      newRows.push(newRow);
    }
    return newRows;
  }
</script>
