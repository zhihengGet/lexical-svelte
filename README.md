the main check [test](https://github.com/zhihengGet/lexical-svelte/tree/test) branch

i forked lexical repo for tracking purpose [fork](<(https://github.com/zhihengGet/lexical)>), ideally we need to catch up commit by commit by i guess it is fine that we just add whatever is needed.

## QuickStart

```shell
pnpm install lexical-svelte-runes@latest @unocss/reset
```

```typescript
<script lang="ts">
	import '@unocss/reset/tailwind-compat.css'; //using unocss reset
	//import 'uno.css';
	import 'lexical-svelte-runes/uno.css';  // import all the generated classname, if you have uno or tailwind, you can ignore this
	import Editor from 'lexical-svelte-runes/Editor.svelte';
	import 'lexical-svelte-runes/index.css'; // react playground css
	import LexicalComposer from 'lexical-svelte-runes/lib/LexicalComposer.svelte';

	import SettingsContext from 'lexical-svelte-runes/playground/context/SettingsContext.svelte';
	import SharedAutocompleteContext from 'lexical-svelte-runes/playground/context/SharedAutocompleteContext.svelte';
	import { createHistoryContext } from 'lexical-svelte-runes/playground/context/SharedHistoryContext';
	import type { Settings } from 'lexical-svelte-runes/playground/appSettings';

	let { ...props }: Settings = $props(); // check Settings type for all the settings!

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


```

# Goal

when importing a new plugin to lexical-svelte-runes, we can use external library instead of copy all the logic from react playground to keep code clean but at the same time we want to 'make sure the structure of our code is similar to react's so that it is easy to debug/maintain, a lot of times we can simply check the commits in rect to copy the changes over.

- migrate to melt-ui/shadcn for components
- use external library instead creating our own
  - image resize library
  - colorPicker components
  - ...
- use feature based folder architecture instead of plugin folder and nodes folder
  - ```
    /dialog
      node.svelte
      plugin.svelte.ts
    ```

# TODO

1. codebase needs cleanup remove unused files,dependencies
2. imports more components from lexical playground
3. setup git actions & releases...

# Contribute How-to

1. since we use runes to [polyfill react hook](/react.d.ts) & [svelte runes](/src/react.svelte.ts), it is super easy to port an component, simply copy the tsx into the right folder, then run autoFix.js to clean the import (removing $ by renaming imports) then fix the code to make it svelte-ish ! remember the output of useState `const [fn,setFn]=useState()` are both function just like solidjs

## steps (wip)

1. clone this repo - we will refer to the cloned repo 'svelte repo'
2. clone official lexical repo - we will refer to the cloned repo 'react repo'
3. go to https://playground.lexical.dev/ and pick something we dont have i.e font dropdown
4. go to react repo, navigate to react playground package,
   1. go to [toolbar](https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx) and recursively copy the necessary code for font dropdown to svelte repo's [toolbar](/src/playground/plugins/ToolbarPlugin/ToolbarPlugin.svelte)
   2. go to editor.tsx , find the plugin for font dropdown (if there is one), resursively copy it over to svelte repo (you might also need to check [https://github.com/facebook/lexical/tree/main/packages/lexical-react](lexical-react), we put put leixcal-playground and lexical-react in one package) , put it under `src/plugins/_` , unlike react repo, we want to group by features, so all required files for a feature should be under src/plugins/\_, dont need to create a separate nodes folder for nodes
   3. now you have a bunch of `.tsx` and `.ts` files under plugins/\* , slowly convert each one to svelte files , for `.ts` you probably just need to fix the errors!
   4. you can use [autoFix](/autoFix.js) to rename imports since svelte does not support `$` in svelte files
   5. **remember when you convert code to svelte , you can use external libs but please keep code structure as similar to the react repo as much as possible for easier debug later on!**
   6. remember to add node to [playgroundNodes](/src/playground/PlaygroundNodes.ts) after your ported from react's repo https://github.com/facebook/lexical/tree/main/packages/lexical-playground/src/nodes
   7. add converted plugins to the editor.tsx in svelte repo
   8. remove unused files i.e .tsx that you used autoFix.js on or some utilities that svelte don't need

# todos...

1. fully migration image inserts, captions (try use a image resize lib instead of writing custom resize logic...)
2. excalidraw
3. finish up autocomplete(current version is customized, i couldnt get lexical-playground's version to work)
4. table
5. sticky note
6. tweet
7. youtube videos
8. figma
9. charts, diagrams...
10. columns layout
11. lexical-devtool-core
