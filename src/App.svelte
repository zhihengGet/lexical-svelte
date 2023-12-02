<script lang="ts">
	import '@unocss/reset/tailwind.css';
	import 'virtual:uno.css';

	import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

	import Editor from './Editor.svelte';
	import './index.css';
	import PlaygroundNodes from './playground/PlaygroundNodes';
	import SettingsContext from './playground/context/SettingsContext.svelte';
	import { createHistoryContext } from './playground/context/SharedHistoryContext';
	import SharedAutocompleteContext from './playground/context/SharedAutocompleteContext.svelte';
	import { ParagraphNode, type LexicalNode } from 'lexical';
	import { CustomParagraphNode } from '@nodes/CustomParagrahNode';
	import LexicalComposer from './lib/LexicalComposer.svelte';
	console.warn(
		'If you are profiling the playground app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.'
	);

	createHistoryContext();
</script>

<SettingsContext>
	<SharedAutocompleteContext>
		<LexicalComposer>
			<div class="editor-shell">
				<Editor />
			</div>
		</LexicalComposer>
	</SharedAutocompleteContext>
</SettingsContext>
