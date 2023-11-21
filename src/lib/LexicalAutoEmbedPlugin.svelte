<script context="module" lang="ts">
  import type {
    CommandListenerPriority,
    LexicalNode,
    MutationListener,
  } from "lexical";

  import {
    $isLinkNode as isLinkNode,
    AutoLinkNode,
    LinkNode,
  } from "@lexical/link";
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.svelte";
  import {
    default as LexicalNodeMenuPlugin,
    MenuOption,
    MenuRenderFn,
  } from "@lexical/react/LexicalNodeMenuPlugin.svelte";
  import { mergeRegister } from "@lexical/utils";
  import * as lexical from "lexical";
  import { useCallback, useEffect, useMemo, useState } from "react";
  import * as React from "react";

  export type EmbedMatchResult<TEmbedMatchResult = unknown> = {
    url: string;
    id: string;
    data?: TEmbedMatchResult;
  };

  export interface EmbedConfig<
    TEmbedMatchResultData = unknown,
    TEmbedMatchResult = EmbedMatchResult<TEmbedMatchResultData>
  > {
    // Used to identify this config e.g. youtube, tweet, google-maps.
    type: string;
    // Determine if a given URL is a match and return url data.
    parseUrl: (
      text: string
    ) => Promise<TEmbedMatchResult | null> | TEmbedMatchResult | null;
    // Create the Lexical embed node from the url data.
    insertNode: (
      editor: lexical.LexicalEditor,
      result: TEmbedMatchResult
    ) => void;
  }
  export const URL_MATCHER =
    /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
  export class AutoEmbedOption extends MenuOption {
    title: string;
    onSelect: (targetNode: LexicalNode | null) => void;
    constructor(
      title: string,
      options: {
        onSelect: (targetNode: LexicalNode | null) => void;
      }
    ) {
      super(title);
      this.title = title;
      this.onSelect = options.onSelect.bind(this);
    }
  }

  export const INSERT_EMBED_COMMAND: lexical.LexicalCommand<
    EmbedConfig["type"]
  > = lexical.createCommand("INSERT_EMBED_COMMAND");
</script>

<script lang="ts">
  type LexicalAutoEmbedPluginProps<TEmbedConfig extends EmbedConfig> = {
    embedConfigs: Array<TEmbedConfig>;
    onOpenEmbedModalForConfig: (embedConfig: TEmbedConfig) => void;
    getMenuOptions: (
      activeEmbedConfig: TEmbedConfig,
      embedFn: () => void,
      dismissFn: () => void
    ) => Array<AutoEmbedOption>;
    menuRenderFn: MenuRenderFn<AutoEmbedOption>;
    menuCommandPriority?: CommandListenerPriority;
  };
  type TEmbedConfig = $$Generic<EmbedConfig>;

  let {
    embedConfigs,
    onOpenEmbedModalForConfig,
    getMenuOptions,
    menuRenderFn,
    menuCommandPriority = lexical.COMMAND_PRIORITY_LOW,
  } = $props<LexicalAutoEmbedPluginProps<TEmbedConfig>>();
  const [editor] = useLexicalComposerContext();

  const [nodeKey, setNodeKey] = useState<lexical.NodeKey | null>(null);
  const [activeEmbedConfig, setActiveEmbedConfig] =
    useState<TEmbedConfig | null>(null);

  const reset = useCallback(() => {
    setNodeKey(null);
    setActiveEmbedConfig(null);
  }, []);

  const checkIfLinkNodeIsEmbeddable = useCallback(
    (key: lexical.NodeKey) => {
      editor.getEditorState().read(async () => {
        const linkNode = lexical.$getNodeByKey(key);
        if (isLinkNode(linkNode)) {
          for (let i = 0; i < embedConfigs.length; i++) {
            const embedConfig = embedConfigs[i];

            const urlMatch = await Promise.resolve(
              embedConfig.parseUrl(linkNode.__url)
            );

            if (urlMatch != null) {
              setActiveEmbedConfig(embedConfig);
              setNodeKey(linkNode.getKey());
            }
          }
        }
      });
    },
    [editor, embedConfigs]
  );

  useEffect(() => {
    const listener: MutationListener = (
      nodeMutations,
      { updateTags, dirtyLeaves }
    ) => {
      for (const [key, mutation] of nodeMutations) {
        if (
          mutation === "created" &&
          updateTags.has("paste") &&
          dirtyLeaves.size <= 3
        ) {
          checkIfLinkNodeIsEmbeddable(key);
        } else if (key === nodeKey()) {
          reset();
        }
      }
    };
    return mergeRegister(
      ...[LinkNode, AutoLinkNode].map((Klass) =>
        editor.registerMutationListener(Klass, (...args) => listener(...args))
      )
    );
  }, [checkIfLinkNodeIsEmbeddable, editor, embedConfigs, nodeKey, reset]);

  useEffect(() => {
    return editor.registerCommand(
      INSERT_EMBED_COMMAND,
      (embedConfigType: TEmbedConfig["type"]) => {
        const embedConfig = embedConfigs.find(
          ({ type }) => type === embedConfigType
        );
        if (embedConfig) {
          onOpenEmbedModalForConfig(embedConfig);
          return true;
        }
        return false;
      },
      lexical.COMMAND_PRIORITY_EDITOR
    );
  }, [editor, embedConfigs, onOpenEmbedModalForConfig]);

  const embedLinkViaActiveEmbedConfig = useCallback(async () => {
    if (activeEmbedConfig != null && nodeKey() != null) {
      const linkNode = editor.getEditorState().read(() => {
        const node = lexical.$getNodeByKey(nodeKey());
        if (isLinkNode(node)) {
          return node;
        }
        return null;
      });

      if (isLinkNode(linkNode)) {
        const result = await Promise.resolve(
          activeEmbedConfig().parseUrl(linkNode.__url)
        );
        if (result != null) {
          editor.update(() => {
            if (!lexical.$getSelection()) {
              linkNode.selectEnd();
            }
            activeEmbedConfig().insertNode(editor, result);
            if (linkNode.isAttached()) {
              linkNode.remove();
            }
          });
        }
      }
    }
  }, [activeEmbedConfig, editor, nodeKey]);

  const options = useMemo(() => {
    return activeEmbedConfig != null && nodeKey != null
      ? getMenuOptions(
          activeEmbedConfig(),
          embedLinkViaActiveEmbedConfig,
          reset
        )
      : [];
  }, [
    activeEmbedConfig,
    embedLinkViaActiveEmbedConfig,
    getMenuOptions,
    nodeKey,
    reset,
  ]);

  const onSelectOption = useCallback(
    (
      selectedOption: AutoEmbedOption,
      targetNode: lexical.TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        selectedOption.onSelect(targetNode);
        closeMenu();
      });
    },
    [editor]
  );
</script>

{#if nodeKey() != null}
  <LexicalNodeMenuPlugin
    nodeKey={nodeKey()}
    onClose={reset}
    {onSelectOption}
    {options}
    {menuRenderFn}
    commandPriority={menuCommandPriority}
  />
{/if}
