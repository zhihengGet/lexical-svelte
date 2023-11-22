<script context="module" lang="ts">
  import type {
    ElementNode,
    LexicalCommand,
    LexicalNode,
    NodeKey,
  } from "lexical";

  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import {
    $insertNodeToNearestRoot as insertNodeToNearestRoot,
    mergeRegister,
  } from "@lexical/utils";
  import {
    $createParagraphNode as createParagraphNode,
    $getNodeByKey as getNodeByKey,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
  } from "lexical";
  import { useEffect } from "react";
  import * as lexical from "lexical";
  import {
    $createLayoutContainerNode as createLayoutContainerNode,
    LayoutContainerNode,
    LayoutItemNode,
  } from ".";

  import * as node from ".";

  export const INSERT_LAYOUT_COMMAND: LexicalCommand<string> =
    createCommand<string>();

  function getItemsCountFromTemplate(template: string): number {
    return template.trim().split(/\s+/).length;
  }

  export const UPDATE_LAYOUT_COMMAND: LexicalCommand<{
    template: string;
    nodeKey: NodeKey;
  }> = createCommand<{ template: string; nodeKey: NodeKey }>();
</script>

<script lang="ts">
  type props = any;

  let {} = $props<props>();

  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor.hasNodes([LayoutContainerNode, LayoutItemNode])) {
      throw new Error(
        "LayoutPlugin: LayoutContainerNode, or LayoutItemNode not registered on editor"
      );
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_LAYOUT_COMMAND,
        (template) => {
          editor.update(() => {
            const container = node.$createLayoutContainerNode(template);
            const itemsCount = getItemsCountFromTemplate(template);

            for (let i = 0; i < itemsCount; i++) {
              container.append(
                node.$createLayoutItemNode().append(node.$createParagraphNode())
              );
            }

            insertNodeToNearestRoot(container);
            container.selectStart();
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        UPDATE_LAYOUT_COMMAND,
        ({ template, nodeKey }) => {
          editor.update(() => {
            const container = lexical.$getNodeByKey<LexicalNode>(nodeKey);

            if (!node.$isLayoutContainerNode(container)) {
              return;
            }

            const itemsCount = getItemsCountFromTemplate(template);
            const prevItemsCount = getItemsCountFromTemplate(
              container.getTemplateColumns()
            );

            // Add or remove extra columns if new template does not match existing one
            if (itemsCount > prevItemsCount) {
              for (let i = prevItemsCount; i < itemsCount; i++) {
                container.append(
                  node.$createLayoutItemNode().append(createParagraphNode())
                );
              }
            } else if (itemsCount < prevItemsCount) {
              for (let i = prevItemsCount; i < itemsCount; i++) {
                const layoutItem = container.getChildAtIndex<LexicalNode>(i);

                if (node.$isLayoutItemNode(layoutItem)) {
                  for (const child of layoutItem.getChildren<LexicalNode>()) {
                    container.insertAfter(child);
                  }
                }
              }
            }

            container.setTemplateColumns(template);
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      // Structure enforcing transformers for each node type. In case nesting structure is not
      // "Container > Item" it'll unwrap nodes and convert it back
      // to regular content.
      editor.registerNodeTransform(LayoutItemNode, (node) => {
        const parent = node.getParent<ElementNode>();
        if (!node.$isLayoutContainerNode(parent)) {
          const children = node.getChildren<LexicalNode>();
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        }
      }),
      editor.registerNodeTransform(LayoutContainerNode, (node) => {
        const children = node.getChildren<LexicalNode>();
        if (!children.every(node.$isLayoutItemNode)) {
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        }
      })
    );
  }, [editor]);
</script>
