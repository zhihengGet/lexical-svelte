check [dev](https://github.com/zhihengGet/lexical-svelte/tree/test) branch please

currently we need to sync with this forked branch or not...

[fork](<[asd](https://github.com/zhihengGet/lexical)>)

shitty readme i know :(

## QuickStart

`pnpm install lexical-svelte-runes@latest`

```typescript
<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	//import 'uno.css';
	import '#uno.css';  // unocss, u can add this repo to tailwindcss so u dont need to import from here
	import Editor from './Editor.svelte';
	import './index.css'; // react playground css
	import LexicalComposer from './lib/LexicalComposer.svelte';

	import SettingsContext from './playground/context/SettingsContext.svelte';
	import SharedAutocompleteContext from './playground/context/SharedAutocompleteContext.svelte';
	import { createHistoryContext } from './playground/context/SharedHistoryContext';
	import type { Settings } from './playground/appSettings';

	let { ...props }: Settings = $props();

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

# Contribute How-to

1. since we use runes to polyfill react hook, it is super easy to port an component, simply copy the tsx into the right folder, then run autoFix.js to clean the import (removing $ by renaming imports) then fix the code to make it svelte-ish ! remember the output of useState `const [fn,setFn]=useState()` are both function just like solidjs

2. you can check other components in the repo to see how it works

# TODO

you can refer to official react playground to see what is missing here

ideally we should catch up the a certain commit and then fix commit by commit but it is fine to just refer to latest lexical-react commits and port over code-diffs
