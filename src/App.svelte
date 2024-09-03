<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import '#uno.css';
	import Editor from './Editor.svelte';
	import './index.css';
	import LexicalComposer from './lib/LexicalComposer.svelte';
	import * as lexical from 'lexical';
	import SettingsContext from './playground/context/SettingsContext.svelte';
	import SharedAutocompleteContext from './playground/context/SharedAutocompleteContext.svelte';
	import { createHistoryContext } from './playground/context/SharedHistoryContext';
	import type { Settings } from './playground/appSettings';
	import { START_COMMENT_NODE } from '@plugins/ParagraphCommentPlugin/paragraphComment';
	let { ...props }: Settings = $props();

	let s = $state({ initialHTML: '<p>hello<p>', equation: true, dev: false });
	$effect.pre(() => {
		//@ts-expect-error make effect reactive
		createHistoryContext(props.initialHTML);
	});
	/* 	$effect(() => {
		const p = document.body.querySelectorAll('p');
		console.log(p);
		for (let x of p) {
			const s = document.createElement('span');
			s.innerText = 'ABC';
			x.append(s);
			console.log(x);
		}
	}); */
	let editor = $state();
</script>

<button
	onclick={() => {
		const p = document.body.querySelectorAll('p');
		console.log(p);
		editor.dispatchCommand(START_COMMENT_NODE, null);
		debugger;
	}}>render</button
>
{#if props.dev}
	<button
		onclick={() => {
			s.initialHTML = '<p>hello v2</p>';
		}}>update html</button
	>
{/if}

{#if s.dev == false}
	<SettingsContext settings={s}>
		<SharedAutocompleteContext>
			<LexicalComposer>
				<div class="editor-shell w-full">
					<Editor />
					<hr />
				</div>
			</LexicalComposer>
		</SharedAutocompleteContext>
	</SettingsContext>
{/if}
{#if s.dev}
	<SettingsContext
		settings={{
			dev: false,
			config: { editable: false },
			initialHTML: `
<h1 class="PlaygroundEditorTheme__h1" dir="ltr">
<code spellcheck="false" style="background-color: rgb(126, 211, 33); color: rgb(0, 0, 0); white-space: pre-wrap;">
<span class="PlaygroundEditorTheme__textCode">let a =b1</span>
</code>
</h1>
<p class="PlaygroundEditorTheme__paragraph">
<br>
</p>
<pre class="PlaygroundEditorTheme__code" spellcheck="false" data-language="javascript" data-highlight-language="javascript">
<span class="PlaygroundEditorTheme__tokenAttr" style="white-space: pre-wrap;">let</span>
<span style="white-space: pre-wrap;"> b</span>
<span class="PlaygroundEditorTheme__tokenOperator" style="white-space: pre-wrap;">=</span>
<span class="PlaygroundEditorTheme__tokenProperty" style="white-space: pre-wrap;">555</span>
<span class="PlaygroundEditorTheme__tokenPunctuation" style="white-space: pre-wrap;">;</span>
</pre>
<p class="PlaygroundEditorTheme__paragraph" dir="ltr">
<span style="color: rgb(0, 0, 0); white-space: pre-wrap;">asdasdaasd</span>
</p>
<p class="PlaygroundEditorTheme__paragraph" dir="ltr">
<sub style="color: rgb(0, 0, 0); white-space: pre-wrap;">
<span class="PlaygroundEditorTheme__textSubscript">fsfsdfsdfsd</span>
</sub>
</p>
<p class="PlaygroundEditorTheme__paragraph" dir="ltr">
<span style="background-color: rgb(126, 211, 33); color: rgb(0, 0, 0); white-space: pre-wrap;">sdfsd</span>
</p>
<p class="PlaygroundEditorTheme__paragraph">
<br>
</p>
<p class="PlaygroundEditorTheme__paragraph" dir="ltr">
<br>
</p>
<p class="PlaygroundEditorTheme__paragraph">
<img src="/assets/yellow-flower-vav9Hsve.jpg" alt="Yellow flower in tilt shift lens" width="inherit" height="inherit">
</p>
<figure type="page-break" style="break-after: page;"></figure>
<h1 class="PlaygroundEditorTheme__h1">
<br>
</h1>
<hr>
<h1 class="PlaygroundEditorTheme__h1" dir="ltr">
<span style="color: rgb(0, 0, 0); white-space: pre-wrap;">asdasd</span>
</h1>
<details class="Collapsible__container" open="true">
<summary class="Collapsible__title">
<p class="PlaygroundEditorTheme__paragraph" dir="ltr">
  <span style="color: rgb(0, 0, 0); white-space: pre-wrap;">sadasd</span>
</p>
</summary>
<div class="Collapsible__content" data-lexical-collapsible-content="true">
<p class="PlaygroundEditorTheme__paragraph">
  <br>
</p>
</div>
</details>
<h1 class="PlaygroundEditorTheme__h1">
<br>
</h1>`
		}}
	>
		<SharedAutocompleteContext>
			<LexicalComposer bind:bindEditor={editor}>
				<div class="editor-shell w-full" style="background:red;">
					<Editor />
				</div>
			</LexicalComposer>
		</SharedAutocompleteContext>
	</SettingsContext>
{/if}
