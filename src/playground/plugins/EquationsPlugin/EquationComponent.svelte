<script context="module" lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { mergeRegister } from '@lexical/utils';
	import {
		$getNodeByKey as getNodeByKey,
		$getSelection as getSelection,
		$isNodeSelection as isNodeSelection,
		COMMAND_PRIORITY_HIGH,
		KEY_ESCAPE_COMMAND,
		type NodeKey,
		SELECTION_CHANGE_COMMAND
	} from 'lexical';

	import { useCallback, useEffect, useRef, useState } from 'react';

	import EquationEditor from './ui/EquationEditor.svelte';
	import KatexRenderer from './KatexRenderer.svelte';
	import { $isEquationNode as isEquationNode } from './EquationNode';

	type EquationComponentProps = {
		equation: string;
		inline: boolean;
		nodeKey: NodeKey;
	};
</script>

<script lang="ts">
	let { equation, inline, nodeKey } = $props<EquationComponentProps>();
	const [editor] = useLexicalComposerContext();
	const [equationValue, setEquationValue] = useState(equation);
	const [showEquationEditor, setShowEquationEditor] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const onHide = useCallback(
		(restoreSelection?: boolean) => {
			setShowEquationEditor(false);
			editor.update(() => {
				const node = getNodeByKey(nodeKey);
				if (isEquationNode(node)) {
					node.setEquation(equationValue());
					if (restoreSelection) {
						node.selectNext(0, 0);
					}
				}
			});
		},
		[editor, equationValue, nodeKey]
	);

	useEffect(() => {
		if (!showEquationEditor && equationValue() !== equation) {
			setEquationValue(equation);
		}
	}, [showEquationEditor, equation, equationValue]);

	useEffect(() => {
		if (showEquationEditor()) {
			return mergeRegister(
				editor.registerCommand(
					SELECTION_CHANGE_COMMAND,
					(payload) => {
						const activeElement = document.activeElement;
						const inputElem = inputRef.current;
						if (inputElem !== activeElement) {
							onHide();
						}
						return false;
					},
					COMMAND_PRIORITY_HIGH
				),
				editor.registerCommand(
					KEY_ESCAPE_COMMAND,
					(payload) => {
						const activeElement = document.activeElement;
						const inputElem = inputRef.current;
						if (inputElem === activeElement) {
							onHide(true);
							return true;
						}
						return false;
					},
					COMMAND_PRIORITY_HIGH
				)
			);
		} else {
			return editor.registerUpdateListener(({ editorState }) => {
				const isSelected = editorState.read(() => {
					const selection = getSelection();
					return (
						isNodeSelection(selection) &&
						selection.has(nodeKey) &&
						selection.getNodes().length === 1
					);
				});
				if (isSelected) {
					setShowEquationEditor(true);
				}
			});
		}
	}, [editor, nodeKey, onHide, showEquationEditor]);
</script>

{#if showEquationEditor()}
	<!-- content here -->
	<EquationEditor
		equation={equationValue()}
		setEquation={setEquationValue}
		{inline}
		forwardedRef={inputRef}
	/>
{:else}
	<!-- render katex -->
	<KatexRenderer
		equation={equationValue()}
		{inline}
		onDoubleClick={() => setShowEquationEditor(true)}
	/>
{/if}
