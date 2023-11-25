const a = `

* LICENSE file in the root directory of this source tree.
*
*/
import './index.css';

import {$isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$findMatchingParent, mergeRegister} from '@lexical/utils';
import {
 $getSelection,
 $isRangeSelection,
 CLICK_COMMAND,
 COMMAND_PRIORITY_CRITICAL,
 COMMAND_PRIORITY_HIGH,
 COMMAND_PRIORITY_LOW,
 GridSelection,
 KEY_ESCAPE_COMMAND,
 LexicalEditor,
 NodeSelection,
 RangeSelection,
 SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {Dispatch, useCallback, useEffect, useRef, useState} from 'react';
import * as React from 'react';
import {createPortal} from 'react-dom';

import {getSelectedNode} from '../../utils/getSelectedNode';
import {setFloatingElemPositionForLinkEditor} from '../../utils/setFloatingElemPositionForLinkEditor';
import {sanitizeUrl} from '../../utils/url';



`;

import { writeFile, readFile } from 'fs/promises';
import { uniq } from 'lodash-es';
import path from 'path';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';
import chalk from 'chalk';

async function process(filename) {
	// all js files, but don't look in node_modules
	const jsfiles = await glob('**/' + filename, { ignore: 'node_modules/**' });
	console.log(jsfiles);
	const content = a || (await readFile(jsfiles[0], { encoding: 'utf-8' }));
	console.log(content);
	const r = /^(\s*import)(.|\n)* from ('.*';)/gm;
	const dollar = /\$[a-zA-Z|_]+/gm;

	const sp = content.match(r);
	console.log(sp);
	const importLines = sp.join('\n');

	console.log(chalk.green(importLines));

	const imports = importLines;
	let rest = content.split(/^(import)(.|\n)* from ('.*';)$/gm).at(-1);
	console.log(rest);
	let new_imports = imports;
	const words = uniq(Array.from(content.matchAll(dollar)).map((v) => v[0]));
	console.log('--------------');
	console.log(new_imports);
	console.log('--------------');
	console.log(words);
	for (let word of words) {
		const new_word = word.substring(1);
		console.log(word);
		new_imports = new_imports.replaceAll(word, word + ' as ' + new_word);
		rest = rest.replaceAll(word, new_word);
	}
	new_imports = new_imports.replace(
		'@lexical/react/LexicalComposerContext',
		'@lexical/react/LexicalComposerContext.svelte'
	);
	await writeFile(jsfiles[0].replace('tsx', 'tsx'), new_imports + rest, () => console.log('wrote'));
}
process('FloatingLinkEditorPlugin/index.tsx');
