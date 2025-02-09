<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import '#uno.css';
	import Editor from './Editor.svelte';
	import './index.css';
	import LexicalComposer from './lib/LexicalComposer.svelte';
	import SettingsContext from './playground/context/SettingsContext.svelte';
	import SharedAutocompleteContext from './playground/context/SharedAutocompleteContext.svelte';
	import { createHistoryContext } from './playground/context/SharedHistoryContext';
	import type { Settings } from './playground/appSettings';
	import type { LexicalEditor } from 'lexical';
	import { ToolbarContext } from '@plugins/ToolbarPlugin/ToolbarContext.svelte';
	let { ...props }: Settings = $props();
	let s = $derived(props);
	$effect.pre(() => {
		//@ts-expect-error make effect reactive
		createHistoryContext(props.initialHTML);
	});
	$inspect('editor props', props);
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
	let editor: LexicalEditor = $state();
	ToolbarContext();
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
<!-- editor 2 -->
<!-- <SettingsContext settings={props}>
	<SharedAutocompleteContext>
		<LexicalComposer>
			<div class="editor-shell w-full">
				<Editor />
			</div>
		</LexicalComposer>
	</SharedAutocompleteContext>
</SettingsContext> -->
{#if false}
	<h2>Read Only</h2>
	<SettingsContext
		settings={{
			...props,
			dev: false,
			autocomplte: true,
			isMarkdown: true,
			config: {
				editable: false,
				query: () => {
					console.log('QUERY CALLED');
				}
			},
			initialHTML: `
	 William Hope Hodgson<p id="inserted" data-chapter-comment-id="9756d5ef-1a9e-4442-b43e-2fa801a8dba4"></p><p class="c" data-chapter-comment-id="bc362530-c724-4896-a120-8bdf62f3b89b"><em>From the Manuscript discovered in 1877 by Messrs. Tonnison and Berreggnogin the Ruins that <br>lie to the South of the Village of Kraighten, in theWest of Ireland. Set out here, with Notes</em>.</p><p data-chapter-comment-id="b86a8e84-48a8-4dde-8857-21dc8a4a4450"></p><p id="inserted" data-chapter-comment-id="12b2d8ca-8844-4316-b3c6-c22376951396"></p><p data-chapter-comment-id="701f59b4-eb46-40ec-b8e3-8c09038aed3b"><br></p><p data-chapter-comment-id="31dd4061-8e4a-4892-813a-023ca48f7d67"></p><p id="inserted" data-chapter-comment-id="3fe4188f-7d78-45f7-8d9e-bba797fc0477"></p><table border="0" cellpadding="3" cellspacing="0" summary=""><tbody><tr><td align="right"><a href="#I">I</a></td><td>THE FINDING OF THE MANUSCRIPT</td></tr><tr><td align="right"><a href="#II">II</a></td><td>THE PLAIN OF SILENCE</td></tr><tr><td align="right"><a href="#III">III</a></td><td>THE HOUSE IN THE ARENA</td></tr><tr><td align="right"><a href="#IV">IV</a></td><td>THE EARTH</td></tr><tr><td align="right"><a href="#V">V</a></td><td>THE THING IN THE PIT</td></tr><tr><td align="right"><a href="#VI">VI</a></td><td>THE SWINE-THINGS</td></tr><tr><td align="right"><a href="#VII">VII</a></td><td>THE ATTACK</td></tr><tr><td align="right"><a href="#VIII">VIII</a></td><td>AFTER THE ATTACK</td></tr><tr><td align="right"><a href="#IX">IX</a></td><td>IN THE CELLARS</td></tr><tr><td align="right"><a href="#X">X</a></td><td>THE TIME OF WAITING</td></tr><tr><td align="right"><a href="#XI">XI</a></td><td>THE SEARCHING OF THE GARDENS</td></tr><tr><td align="right"><a href="#XII">XII</a></td><td>THE SUBTERRANEAN PIT</td></tr><tr><td align="right"><a href="#XIII">XIII</a></td><td>THE TRAP IN THE GREAT CELLAR</td></tr><tr><td align="right"><a href="#XIV">XIV</a></td><td>THE SEA OF SLEEP</td></tr><tr><td align="right"><a href="#XV">XV</a></td><td>THE NOISE IN THE NIGHT</td></tr><tr><td align="right"><a href="#XVI">XVI</a></td><td>THE AWAKENING</td></tr><tr><td align="right"><a href="#XVII">XVII</a></td><td>THE SLOWING ROTATION</td></tr><tr><td align="right"><a href="#XVIII">XVIII</a></td><td>THE GREEN STAR</td></tr><tr><td align="right"><a href="#XIX">XIX</a></td><td>THE END OF THE SOLAR SYSTEM</td></tr><tr><td align="right"><a href="#XX">XX</a></td><td>THE CELESTIAL GLOBES</td></tr><tr><td align="right"><a href="#XXI">XXI</a></td><td>THE DARK SUN</td></tr><tr><td align="right"><a href="#XXII">XXII</a></td><td>THE DARK NEBULA</td></tr><tr><td align="right"><a href="#XXIII">XXIII</a></td><td>PEPPER</td></tr><tr><td align="right"><a href="#XXIV">XXIV</a></td><td>THE FOOTSTEPS IN THE GARDEN</td></tr><tr><td align="right"><a href="#XXV">XXV</a></td><td>THE THING FROM THE ARENA</td></tr><tr><td align="right"><a href="#XXVI">XXVI</a></td><td>THE LUMINOUS SPECK</td></tr><tr><td align="right"><a href="#XXVII">XXVII</a></td><td>CONCLUSION</td></tr></tbody></table><p data-chapter-comment-id="cb781aea-5122-47d8-93c1-3dfaa39be575"></p><p id="inserted" data-chapter-comment-id="3acdd481-814f-4a49-bc2c-f8c9cb8da2ab"><br></p><p id="inserted" data-chapter-comment-id="1fc6c515-c302-4546-8307-7a53475e9dfd"><br></p>`
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
