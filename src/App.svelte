<script lang="ts">
	import { default as LexicalComposer } from '@lexical/react/LexicalComposer.svelte';
	import * as richText from '@lexical/rich-text';
	import * as lexical from 'lexical';
	import 'virtual:uno.css';
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

	function prepopulatedRichText() {
		const root = lexical.$getRoot();
		if (root.getFirstChild() === null) {
			const heading = richText.$createHeadingNode('h1');
			heading.append(lexical.$createTextNode('Welcome to the playground'));
			root.append(heading);

			const paragraph = lexical.$createParagraphNode();
			paragraph.append(
				lexical.$createTextNode('The playground is a demo environment built with '),
				lexical.$createTextNode('@lexical/react').toggleFormat('code'),
				lexical.$createTextNode('.'),
				lexical.$createTextNode(' Try typing in '),
				lexical.$createTextNode('some text').toggleFormat('bold'),
				lexical.$createTextNode(' with '),
				lexical.$createTextNode('different').toggleFormat('italic'),
				lexical.$createTextNode(' formats.')
			);
			root.append(paragraph);
			const paragraph2 = lexical.$createParagraphNode();
			paragraph2.append(
				lexical.$createTextNode(
					'Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!'
				)
			);
			root.append(paragraph2);
			const paragraph3 = lexical.$createParagraphNode();
			paragraph3.append(
				lexical.$createTextNode(`If you'd like to find out more about Lexical, you can:`)
			);
			root.append(paragraph3);

			const paragraph4 = lexical.$createParagraphNode();
			paragraph4.append(
				lexical.$createTextNode(
					`Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance :).`
				)
			);
			root.append(paragraph4);
		}
	}

	const initialConfig = {
		editorState: null,
		namespace: 'Playground',
		nodes: [...PlaygroundNodes],
		onError: (error: Error) => {
			console.log('error initialize', error);
			throw error;
		},
		theme: PlaygroundEditorTheme
	};
	createHistoryContext();
</script>

<main>
	<div />
	<SettingsContext>
		<SharedAutocompleteContext>
			<LexicalComposer {initialConfig}>
				<header>
					<a href="https://lexical.dev" target="_blank" rel="noreferrer"> header </a>
				</header>
				<div class="editor-shell">
					<Editor />
				</div>
			</LexicalComposer>
		</SharedAutocompleteContext>
	</SettingsContext>

	<p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>
