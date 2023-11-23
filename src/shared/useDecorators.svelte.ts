/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from 'lexical';

import { useEffect, useMemo, useState } from '../react.svelte';
import useLayoutEffect from 'shared/useLayoutEffect.svelte';
import { flushSync } from 'svelte';
import type { SvelteRender } from '@lexical/react/types';

export function useDecorators(editor: LexicalEditor) {
	const [decorators, setDecorators] = useState<Record<string, SvelteRender>>(
		editor.getDecorators<SvelteRender>()
	);

	// Subscribe to changes
	useLayoutEffect(() => {
		return editor.registerDecoratorListener<SvelteRender>((nextDecorators) => {
			flushSync(() => {
				setDecorators(nextDecorators);
			});
		});
	});

	useEffect(() => {
		// If the content editable mounts before the subscription is added, then
		// nothing will be rendered on initial pass. We can get around that by
		// ensuring that we set the value.
		setDecorators(editor.getDecorators());
	}, [editor]);

	// Return decorators defined as React Portals

	return useMemo(() => {
		const decoratedPortals: SvelteRender[] = [];
		const decoratorKeys = Object.keys(decorators);

		for (let i = 0; i < decoratorKeys.length; i++) {
			const nodeKey = decoratorKeys[i];

			const element = editor.getElementByKey(nodeKey);

			if (element !== null) {
				decoratedPortals.push((decorators()[nodeKey], element, nodeKey));
			}
		}

		return decoratedPortals;
	}, [decorators, editor]);
}
