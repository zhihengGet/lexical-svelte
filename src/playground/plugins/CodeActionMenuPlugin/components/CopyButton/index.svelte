<script lang="ts" context="module">
	import { $isCodeNode as isCodeNode } from '@lexical/code';
	import {
		$getNearestNodeFromDOMNode as getNearestNodeFromDOMNode,
		$getSelection as getSelection,
		$setSelection as setSelection,
		type LexicalEditor
	} from 'lexical';
	import { useState } from 'react';
	import { useDebounce } from '../../utils';
</script>

<script lang="ts">
	interface Props {
		editor: LexicalEditor;
		getCodeDOMNode: () => HTMLElement | null;
	}
	let { editor, getCodeDOMNode } = $props<Props>();
	const [isCopyCompleted, setCopyCompleted] = useState<boolean>(false);

	const removeSuccessIcon = useDebounce(() => {
		setCopyCompleted(false);
	}, 1000);

	async function handleClick(): Promise<void> {
		const codeDOMNode = getCodeDOMNode();

		if (!codeDOMNode) {
			return;
		}

		let content = '';

		editor.update(() => {
			const codeNode = getNearestNodeFromDOMNode(codeDOMNode);

			if (isCodeNode(codeNode)) {
				content = codeNode.getTextContent();
			}

			const selection = getSelection();
			setSelection(selection);
		});

		try {
			await navigator.clipboard.writeText(content);
			setCopyCompleted(true);
			removeSuccessIcon();
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	}
</script>

<button class="menu-item" on:click={handleClick} aria-label="copy">
	{#if isCopyCompleted()}
		<i class="format success" />
	{:else}
		<i class="format copy" />
	{/if}
</button>
