/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from 'lexical';

import {
	type SvelteComponent,
	createRoot,
	flushSync,
	getAllContexts,
	mount,
	onMount
} from 'svelte';
import type { SvelteRender } from '@lexical/react/types';
export function useDecorators(editor: LexicalEditor) {
	let isChanged = $state(false);
	let decorators = editor.getDecorators<SvelteRender>();
	/* 	const [decorators7, setDecorators] =useState<Record<string, SvelteRender>>(
		editor.getDecorators<SvelteRender>()
	);
 */
	// Subscribe to changes

	// If the content editable mounts before the subscription is added, then
	// nothing will be rendered on initial pass. We can get around that by
	// ensuring that we set the value.
	onMount(() => {
		decorators = editor.getDecorators();
		isChanged = !isChanged;
	});
	const context = getAllContexts();
	let old: (() => unknown)[] = [];
	onMount(() => {
		//NOTE
		// do not render decorators with portal because lexical need to be in sync with svelte, node might not be rendered by the time lexical wants it
		return editor.registerDecoratorListener<SvelteRender>((nextDecorators) => {
			flushSync(() => {
				decorators = nextDecorators;

				const decoratorKeys = Object.keys(decorators);
				old.forEach((v) => v()); // destroy old component, even though lexical will remove them , we need to clean $effect
				old = [];
				for (let i = 0; i < decoratorKeys.length; i++) {
					const nodeKey = decoratorKeys[i];

					const element = editor.getElementByKey(nodeKey);

					if (element !== null) {
						const node = decorators[nodeKey];
						node.target = element;
						node.nodeKey = nodeKey;
						Promise.resolve(node.component).then((v) => {
							const [accessor, destroy] = mount(v, {
								props: node.props,
								target: node.target || document.body,
								context: context
							});
							old.push(destroy);
						}); //dynamic import component

						// lexical will handle removal of this node
					}
				}
			});
		});
	});

	return () => undefined;
}
