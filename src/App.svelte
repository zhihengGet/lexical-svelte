<script lang="ts">
	import '@unocss/reset/tailwind.css';
	import './uno.css';
	import Editor from './Editor.svelte';
	import './index.css';
	import LexicalComposer from './lib/LexicalComposer.svelte';

	import SettingsContext from './playground/context/SettingsContext.svelte';
	import SharedAutocompleteContext from './playground/context/SharedAutocompleteContext.svelte';
	import { createHistoryContext } from './playground/context/SharedHistoryContext';
	import type { Settings } from './playground/appSettings';

	let { ...props } = $props<Settings>();
	createHistoryContext();

	/* 	const p = $state<Settings>({ isAutocomplete: true }); */
</script>

<!-- <button onclick={() => (p.isAutocomplete = false)}>click</button> -->
<SettingsContext settings={p}>
	<SharedAutocompleteContext>
		<LexicalComposer>
			<div class="editor-shell w-full">
				<Editor />
			</div>
		</LexicalComposer>
	</SharedAutocompleteContext>
</SettingsContext>
