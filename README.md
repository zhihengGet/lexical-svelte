i forked lexical repo for tracking purpose [fork](<(https://github.com/zhihengGet/lexical)>), ideally we need to catch up commit by commit by it is fine that we just add whatever is needed.

## QuickStart

```shell
pnpm install lexical-svelte-runes@latest @unocss/reset
```

im not able to make it work on stackblitz due to some weird 'cross-origin frame' but it should work in your own project, copy the code !

https://stackblitz.com/edit/vitejs-vite-pzwyu3?file=src%2FApp.svelte

# Goal

### Importing Plugins into `lexical-svelte-runes`

When adding new plugins to `lexical-svelte-runes`, use external libraries instead of copying all the logic from the React playground. This keeps our code clean and maintainable.

#### we also want to ensure our code structure is similar to React's !

### libs

- **Melt-UI, UnoCSS, and Svelte-ShadCN**:
- **Image Resize Library**: For efficient image manipulation.
- **ColorPicker Components**: color selection.

# TODO

1. codebase needs cleanup remove unused files,dependencies
2. imports more components from lexical playground
3. setup git actions & releases...

# How-to Convert react-playground to svelte

Short version

since we use runes to [polyfill react hook](/react.d.ts) & [svelte runes](/src/react.svelte.ts), it is super easy to port an component, simply copy the tsx into the right folder(i.e [playground](/src/playground/plugins/)), then run autoFix.js to clean the import (removing $ by renaming imports) then fix the code to make it svelte-ish ! remember the output of useState `const [fn,setFn]=useState()` are both function just like _solid_

## Steps (wip)

(we also need to refractor the current repo, i.e move all plugins in to the same folder currently there are some naughty plugins outside )

1. clone the lexical-svelte(the repo you are on now) repo - we will refer to the cloned repo 'svelte repo'
2. clone official lexical repo - we will refer to the cloned repo 'react repo'
3. go to https://playground.lexical.dev/ and pick something we dont have i.e font dropdown
4. go to react repo, navigate to react playground package,
   1. go to [toolbar](https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx) and recursively copy the necessary code for font dropdown to svelte repo's [toolbar](/src/playground/plugins/ToolbarPlugin/ToolbarPlugin.svelte)
   2. go to editor.tsx , find the plugin for font dropdown (if there is one), recursively copy it over to svelte repo (you might also need to check [https://github.com/facebook/lexical/tree/main/packages/lexical-react](lexical-react), we put put leixcal-playground and lexical-react in one package) , put it under `src/playground/plugins/_`, unlike react repo, we want to group by features, so all required files for a feature should be under src/plugins/\_, dont need to create a separate nodes folder for nodes
   3. now you have a bunch of `.tsx` and `.ts` files under plugins/\* , slowly convert each one to svelte files , for `.ts` you probably just need to fix the errors due to our svelte hooks !
   4. you can use [autoFix](/autoFix.js) to rename imports since svelte does not support `$` in svelte files
   5. **remember when you convert code to svelte , you can use external libs but please keep code structure as similar to the react repo as much as possible for easier debug later on!**
   6. remember to add node to [playgroundNodes](/src/playground/PlaygroundNodes.ts) after your ported from react's repo https://github.com/facebook/lexical/tree/main/packages/lexical-playground/src/nodes
   7. add converted plugins to the editor.tsx in svelte repo
   8. remove unused files
      1. i.e .tsx that you used autoFix.js on or some utilities that svelte don't need

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
