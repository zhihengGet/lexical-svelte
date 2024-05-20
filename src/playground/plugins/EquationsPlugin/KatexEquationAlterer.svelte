<script context="module" lang="ts">
</script>

<script lang="ts">
	type Props = {
		initialEquation?: string;
		onConfirm: (equation: string, inline: boolean) => void;
	};
	import './KatexEquationAlterer.css';
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import * as React from 'react';
	import { useCallback, useState } from 'react';

	import Button from '@ui/Button.svelte';
	import KatexRenderer from './KatexRenderer.svelte';

	let { onConfirm, initialEquation = '' }: Props = $props();
	const [editor] = useLexicalComposerContext();
	const [equation, setEquation] = useState<string>(initialEquation);
	const [inline, setInline] = useState<boolean>(true);

	const onClick = useCallback(() => {
		onConfirm(equation(), inline());
	}, [onConfirm, equation, inline]);

	const onCheckboxChange = useCallback(() => {
		setInline(!inline());
	}, [setInline, inline]);
</script>

<div class="KatexEquationAlterer_defaultRow">
	Inline
	<input type="checkbox" checked={inline()} onchange={onCheckboxChange} />
</div>
<div class="KatexEquationAlterer_defaultRow">Equation</div>
<div class="KatexEquationAlterer_centerRow">
	{#if inline()}
		<input
			oninput={(event) => setEquation(event.target.value)}
			class="KatexEquationAlterer_textArea border-1"
		/>
	{:else}
		<textarea
			oninput={(event) => setEquation(event.target.value)}
			class="KatexEquationAlterer_textArea border-1"
		></textarea>
	{/if}
</div>
<div class="KatexEquationAlterer_defaultRow">Visualization</div>
<div class="KatexEquationAlterer_centerRow">
	<KatexRenderer equation={equation()} inline={false} onDoubleClick={() => null} />
</div>
<div class="KatexEquationAlterer_dialogActions">
	<Button {onClick}>Confirm</Button>
</div>
