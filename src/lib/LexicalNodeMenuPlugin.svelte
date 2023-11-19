<script context="module" lang="ts">
  export type NodeMenuPluginProps<TOption extends MenuOption> = {
    onSelectOption: (
      option: TOption,
      textNodeContainingQuery: lexical.TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => void;
    options: Array<TOption>;
    nodeKey: lexical.NodeKey | null;
    onClose?: () => void;
    onOpen?: (resolution: MenuResolution) => void;
    menuRenderFn: MenuRenderFn<TOption>;
    anchorClassName?: string;
    commandPriority?: CommandListenerPriority;
  };
</script>

<script lang="ts">
  import type { MenuRenderFn, MenuResolution } from "../shared/LexicalMenu";

  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
  import * as lexical from "lexical";
  import {
    COMMAND_PRIORITY_LOW,
    CommandListenerPriority,
    NodeKey,
    TextNode,
  } from "lexical";
  import {
    LexicalMenu,
    MenuOption,
    useMenuAnchorRef,
  } from "../shared/LexicalMenu";
  import { SvelteComponent, tick } from "svelte";
  import { pluginTypes, useState } from "../react.svelte";

  function startTransition(callback: () => void) {
    tick().then(callback);
  }

  export function LexicalNodeMenuPlugin<TOption extends MenuOption>({
    options,
    nodeKey,
    onClose,
    onOpen,
    onSelectOption,
    menuRenderFn,
    anchorClassName,
    commandPriority = COMMAND_PRIORITY_LOW,
  }: NodeMenuPluginProps<TOption>): pluginTypes {
    const [editor] = useLexicalComposerContext();
    const [resolution, setResolution] = useState<MenuResolution | null>(null);
    const anchorElementRef = useMenuAnchorRef(
      resolution,
      setResolution,
      anchorClassName
    );

    const closeNodeMenu = useCallback(() => {
      setResolution(null);
      if (onClose != null && resolution !== null) {
        onClose();
      }
    }, [onClose, resolution]);

    const openNodeMenu = useCallback(
      (res: MenuResolution) => {
        setResolution(res);
        if (onOpen != null && resolution === null) {
          onOpen(res);
        }
      },
      [onOpen, resolution]
    );

    const positionOrCloseMenu = useCallback(() => {
      if (nodeKey) {
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          const domElement = editor.getElementByKey(nodeKey);
          if (node != null && domElement != null) {
            if (resolution == null) {
              startTransition(() =>
                openNodeMenu({
                  getRect: () => domElement.getBoundingClientRect(),
                })
              );
            }
          }
        });
      } else if (nodeKey == null && resolution != null) {
        closeNodeMenu();
      }
    }, [closeNodeMenu, editor, nodeKey, openNodeMenu, resolution]);

    useEffect(() => {
      positionOrCloseMenu();
    }, [positionOrCloseMenu, nodeKey]);

    useEffect(() => {
      if (nodeKey != null) {
        return editor.registerUpdateListener(({ dirtyElements }) => {
          if (dirtyElements.get(nodeKey)) {
            positionOrCloseMenu();
          }
        });
      }
    }, [editor, positionOrCloseMenu, nodeKey]);
  }

  export { MenuOption, MenuRenderFn, MenuResolution };
</script>

/** * Copyright (c) Meta Platforms, Inc. and affiliates. * * This source code is
licensed under the MIT license found in the * LICENSE file in the root directory
of this source tree. * */

{#if resolution !== null && editor != null}
  <LexicalMenu
    close={closeNodeMenu}
    {resolution}
    {editor}
    {anchorElementRef}
    {options}
    {menuRenderFn}
    {onSelectOption}
    {commandPriority}
  />
{/if}
