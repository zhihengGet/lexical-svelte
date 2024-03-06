<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import './uno.css';
	import 'uno.css';
	import Editor from './Editor.svelte';
	import './index.css';
	import LexicalComposer from './lib/LexicalComposer.svelte';

	import SettingsContext from './playground/context/SettingsContext.svelte';
	import SharedAutocompleteContext from './playground/context/SharedAutocompleteContext.svelte';
	import { createHistoryContext } from './playground/context/SharedHistoryContext';
	import type { Settings } from './playground/appSettings';

	let { ...props } = $props<Settings>();
	createHistoryContext();
</script>

<SettingsContext settings={props}>
	<SharedAutocompleteContext>
		<LexicalComposer>
			<div class="editor-shell w-full">
				<Editor />
			</div>
		</LexicalComposer>
	</SharedAutocompleteContext>
</SettingsContext>
