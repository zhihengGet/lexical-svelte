<script lang="ts" context="module">
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	import './EquationEditor.css';

	type BaseEquationEditorProps = {
		equation: string;
		inline: boolean;
		setEquation: (equation: string) => void;
		forwardedRef: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement>;
	};
</script>

<script lang="ts">
	type Props = BaseEquationEditorProps;
	let { equation, setEquation, inline, forwardedRef } = $props<Props>();
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
			autofocus={true}
			bind:this={forwardedRef.current}
		/>
		<span class="EquationEditor_dollarSign">$</span>
	</span>
{:else}
	<div class="EquationEditor_inputBackground">
		<span class="EquationEditor_dollarSign">{'$$\n'}</span>
		<textarea
			class="EquationEditor_blockEditor"
			oninput={onChange}
			bind:this={forwardedRef.current}
		/>
		<span class="EquationEditor_dollarSign">{'\n$$'}</span>
	</div>
{/if}
