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
	import { useEffect } from 'react';
	
import { $createEquationNode as createEquationNode, EquationNode } from './EquationNode';
	
const [editor] = useLexicalComposerContext();

	useEffect(() => {
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
	}, [editor]);
</script>
