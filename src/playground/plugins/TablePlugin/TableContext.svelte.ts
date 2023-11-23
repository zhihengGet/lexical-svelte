/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { SvelteRender } from '@lexical/react/types';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import {
	$insertNodes,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
	EditorThemeClasses,
	Klass,
	LexicalCommand,
	LexicalEditor,
	LexicalNode
} from 'lexical';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import invariant from 'shared/invariant';
import { getContext, setContext } from 'svelte';

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
const KEY = 'table context';
export const setTableContext = () => {
	const [contextValue, setContextValue] = useState<{
		cellEditorConfig: null | CellEditorConfig;
		cellEditorPlugins: null | SvelteRender | Array<SvelteRender>;
	}>({
		cellEditorConfig: null,
		cellEditorPlugins: null
	});
	const a = useMemo(
		() => ({
			cellEditorConfig: contextValue.cellEditorConfig,
			cellEditorPlugins: contextValue.cellEditorPlugins,
			set: (cellEditorConfig: CellEditorConfig, cellEditorPlugins: SvelteRender) => {
				setContextValue({ cellEditorConfig, cellEditorPlugins });
			}
		}),
		[contextValue.cellEditorConfig, contextValue.cellEditorPlugins]
	);
	setContext(KEY, a);
};

export const getTableConext = () => getContext(KEY) as CellContextShape;
