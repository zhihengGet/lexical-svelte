# currently we need to sync with this forked branch

# shitty readme i know :(

# style

1. remember to import @unocss/reset/tailwind-compat.css
2. if u use tailwindcss or unocss , then u need to add this node modules to the content in your config
   1. if you are not using them, you can import uno.css from dist
3. import index.css for lexical playground css

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
