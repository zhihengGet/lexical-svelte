<script lang="ts">
	import Editor from './Editor.svelte';
	import LexicalComposer from './lib/LexicalComposer.svelte';
	import SettingsContext from './playground/context/SettingsContext.svelte';
	import SharedAutocompleteContext from './playground/context/SharedAutocompleteContext.svelte';
	import { createHistoryContext } from './playground/context/SharedHistoryContext';
	import type { Settings } from './playground/appSettings';

	let { ...props }: Settings = $props();

	$effect.pre(() => {
		// clear history when initialHTMl changes which is rare
		createHistoryContext(props.initialHTML);
	});
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
