<script context="module" lang="ts">
	type CommandPayload = {
		equation: string;
		inline: boolean;
	};
	export const INSERT_EQUATION_COMMAND: LexicalCommand<CommandPayload> =
		createCommand('INSERT_EQUATION_COMMAND');
</script>

<script lang="ts">
	import 'katex/dist/katex.css';

	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { $wrapNodeInElement as wrapNodeInElement } from '@lexical/utils';
	import type { LexicalCommand } from 'lexical';
	import {
		$createParagraphNode as createParagraphNode,
		$insertNodes as insertNodes,
		$isRootOrShadowRoot as isRootOrShadowRoot,
		COMMAND_PRIORITY_EDITOR,
		createCommand
	} from 'lexical';
	import { useCallback, useEffect } from 'react';
	import * as React from 'react';

	import { $createEquationNode as createEquationNode, EquationNode } from './EquationNode';
	import KatexEquationAlterer from './KatexEquationAlterer.svelte';

	const [editor] = useLexicalComposerContext();

	$effect(() => {
		if (!editor.hasNodes([EquationNode])) {
			throw new Error('EquationsPlugins: EquationsNode not registered on editor');
		}
		return editor.registerCommand<CommandPayload>(
			INSERT_EQUATION_COMMAND,
			(payload) => {
				const { equation, inline } = payload;

				const equationNode = createEquationNode(equation, inline);

				insertNodes([equationNode]);
				if (isRootOrShadowRoot(equationNode.getParentOrThrow())) {
					wrapNodeInElement(equationNode, createParagraphNode).selectEnd();
				}

				return true;
			},
			COMMAND_PRIORITY_EDITOR
		);
	});
</script>
