/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from 'lexical';

import { flushSync, onMount, unstate, untrack } from 'svelte';
import type { SvelteRender } from '@lexical/react/types';

export function useDecorators(editor: LexicalEditor) {
	let isUpdated = $state(false);
	let decorators = editor.getDecorators<SvelteRender>();
	/* 	const [decoratorss, setDecorators] =$state()  useState<Record<string, SvelteRender>>(
		editor.getDecorators<SvelteRender>()
	);
 */
	// Subscribe to changes

	// If the content editable mounts before the subscription is added, then
	// nothing will be rendered on initial pass. We can get around that by
	// ensuring that we set the value.
	onMount(() => {
		decorators = editor.getDecorators();
	});

	editor.registerDecoratorListener<SvelteRender>((nextDecorators) => {
		flushSync(() => {
			decorators = nextDecorators;
		});
		isUpdated = true;
	});

	// Return decorators defined as React Portals/
	const toRender = $derived(() => {
		if (!isUpdated) {
			return;
		}

		const decoratedPortals: SvelteRender[] = [];
		const decoratorKeys = Object.keys(unstate(decorators));

		for (let i = 0; i < decoratorKeys.length; i++) {
			const nodeKey = decoratorKeys[i];

			const element = editor.getElementByKey(nodeKey);

			if (element !== null) {
				//	console.log(element);
				const node = decorators[nodeKey];
				node.target = element;
				node.nodeKey = nodeKey;
				node.portal = true;
				decoratedPortals.push(node);
				//rendered.add(element);
			}
		}
		untrack(() => {
			isUpdated = false;
		});
		//console.log('to be rendered');
		return decoratedPortals;
	});

	return toRender;
}
