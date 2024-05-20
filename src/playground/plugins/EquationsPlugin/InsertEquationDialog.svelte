<script lang="ts">
	import type { LexicalEditor } from 'lexical';
	import KatexEquationAlterer from './KatexEquationAlterer.svelte';
	import { useCallback } from 'react';
	import { INSERT_EQUATION_COMMAND } from './EquationsPlugin.svelte';

	let {
		activeEditor,
		onClose
	}: {
		activeEditor: LexicalEditor;
		onClose: () => void;
	} = $props();
	const onEquationConfirm = useCallback(
		(equation: string, inline: boolean) => {
			activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, {
				equation,
				inline
			});
			onClose();
		},
		[activeEditor, onClose]
	);
</script>

<KatexEquationAlterer onConfirm={onEquationConfirm} />
