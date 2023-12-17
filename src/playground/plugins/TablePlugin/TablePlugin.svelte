<script context="module" lang="ts">
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	









import {
		type Klass,
		type LexicalNode,
		type LexicalEditor,
		type EditorThemeClasses,
		type LexicalCommand,
		createCommand
	} from 'lexical';

	import { createContext } from 'react';
	



export type InsertTableCommandPayload = Readonly<{
		columns: string;
		rows: string;
		includeHeaders?: boolean;
	}>;

	export type CellContextShape = {
		cellEditorConfig: null | CellEditorConfig;
		cellEditorPlugins: null | JSX.Element | Array<JSX.Element>;
		set: (
			cellEditorConfig: null | CellEditorConfig,
			cellEditorPlugins: null | JSX.Element | Array<JSX.Element>
		) => void;
	};

	export type CellEditorConfig = Readonly<{
		namespace: string;
		nodes?: ReadonlyArray<Klass<LexicalNode>>;
		onError: (error: Error, editor: LexicalEditor) => void;
		readOnly?: boolean;
		theme?: EditorThemeClasses;
	}>;

	export const INSERT_NEW_TABLE_COMMAND: LexicalCommand<InsertTableCommandPayload> = createCommand(
		'INSERT_NEW_TABLE_COMMAND'
	);

	export const CellContext = createContext<CellContextShape>({
		cellEditorConfig: null,
		cellEditorPlugins: null,
		set: () => {
			// Empty
		}
	});
</script>

<script lang="ts">
</script>
