<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	//import 'uno.css';
	//import '#uno.css';
	import Editor from './Editor.svelte';
	import './index.css';
	import LexicalComposer from './lib/LexicalComposer.svelte';

	import SettingsContext from './playground/context/SettingsContext.svelte';
	import SharedAutocompleteContext from './playground/context/SharedAutocompleteContext.svelte';
	import { createHistoryContext } from './playground/context/SharedHistoryContext';
	import type { Settings } from './playground/appSettings';
	let { ...props }: Settings = $props();

	let s = $state({ initialHTML: '<p>hello<p>', equation: true });
	$effect.pre(() => {
		//@ts-expect-error make effect reactive
		createHistoryContext(props.initialHTML);
	});
</script>

{#if props.dev}
	<button
		onclick={() => {
			s.initialHTML = '<p>hello v2</p>';
		}}>update html</button
	>
{/if}

<SettingsContext settings={s}>
	<SharedAutocompleteContext>
		<LexicalComposer>
			<div class="editor-shell w-full">
				<Editor />
			</div>
		</LexicalComposer>
	</SharedAutocompleteContext>
</SettingsContext>
