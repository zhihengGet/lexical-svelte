/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Provider } from '@lexical/yjs';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';

// parent dom -> child doc
export function createWebsocketProvider(id: string, yjsDocMap: Map<string, Doc>): Provider {
	const url = new URL(typeof window == 'undefined' ? '' : window.location.href);
	const params = new URLSearchParams(url.search);
	const WEBSOCKET_ENDPOINT = params.get('collabEndpoint') || 'ws://localhost:1234';
	const WEBSOCKET_SLUG = 'playground';
	const WEBSOCKET_ID = params.get('collabId') || '0';
	let doc = yjsDocMap.get(id);

	if (doc === undefined) {
		doc = new Doc();
		yjsDocMap.set(id, doc);
	} else {
		doc.load();
	}

	// @ts-ignore
	return new WebsocketProvider(
		WEBSOCKET_ENDPOINT,
		WEBSOCKET_SLUG + '/' + WEBSOCKET_ID + '/' + id,
		doc,
		{
			connect: false
		}
	);
}
