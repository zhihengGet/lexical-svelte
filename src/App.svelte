<script lang="ts">
	import '@unocss/reset/normalize.css';
	import 'virtual:uno.css';
	import { default as LexicalComposer } from '@lexical/react/LexicalComposer.svelte';

	import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

	import Editor from './Editor.svelte';
	import './index.css';
	import PlaygroundNodes from './playground/PlaygroundNodes';
	import SettingsContext from './playground/context/SettingsContext.svelte';
	import { createHistoryContext } from './playground/context/SharedHistoryContext';
	import SharedAutocompleteContext from './playground/context/SharedAutocompleteContext.svelte';
	console.warn(
		'If you are profiling the playground app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.'
	);
	const initialConfig = {
		editorState: JSON.stringify(
			{
				editorState: {
					root: {
						children: [
							{
								children: [
									{
										detail: 0,
										format: 0,
										mode: 'normal',
										style: '',
										text: '2e',
										type: 'text',
										version: 1
									}
								],
								direction: 'ltr',
								format: '',
								indent: 0,
								type: 'paragraph',
								version: 1
							}
						],
						direction: 'ltr',
						format: '',
						indent: 0,
						type: 'root',
						version: 1
					}
				},
				lastSaved: 1701226322214,
				source: 'Playground',
				version: '0.12.4'
			}.editorState
		),
		namespace: 'Playground',
		nodes: [...PlaygroundNodes],
		onError: (error: Error) => {
			console.error('error initialize', error);
			throw error;
		},
		theme: PlaygroundEditorTheme
	};
	createHistoryContext();
</script>

<SettingsContext>
	<SharedAutocompleteContext>
		<LexicalComposer {initialConfig}>
			<div class="editor-shell">
				<Editor />
			</div>
		</LexicalComposer>
	</SharedAutocompleteContext>
</SettingsContext>
