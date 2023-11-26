<script context="module" lang="ts">
	import './EquationEditor.css';
	import type React from '../../../../react';
	type BaseEquationEditorProps = {
		equation: string;
		inline: boolean;
		setEquation: (equation: string) => void;
		forwardedRef: React.MutableRefObject<HTMLInputElement>;
	};
</script>

<script lang="ts">
	let { equation, setEquation, inline, forwardedRef } = $props<BaseEquationEditorProps>();
	const onChange = (event: InputEvent) => {
		setEquation((event.target as HTMLInputElement).value);
	};
</script>

{#if inline && forwardedRef instanceof HTMLInputElement}
	<span class="EquationEditor_inputBackground">
		<span class="EquationEditor_dollarSign">$</span>
		<input
			class="EquationEditor_inlineEditor"
			value={equation}
			oninput={onChange}
			bind:this={forwardedRef.current}
		/>
		<span class="EquationEditor_dollarSign">$</span>
	</span>
{:else}
	<div class="EquationEditor_inputBackground">
		<span class="EquationEditor_dollarSign">{'$$\n'}</span>
		<textarea
			class="EquationEditor_blockEditor"
			value={equation}
			oninput={onChange}
			bind:this={forwardedRef.current}
		/>
		<span class="EquationEditor_dollarSign">{'\n$$'}</span>
	</div>
{/if}
