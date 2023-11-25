const a = `


import {
	$getSelection,
	$isParagraphNode,
	$isRangeSelection,
	$isTextNode,
	COMMAND_PRIORITY_LOW,
	FORMAT_TEXT_COMMAND,
	LexicalEditor,
	SELECTION_CHANGE_COMMAND
} from 'lexical';


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
	const content = await readFile(jsfiles[0], { encoding: 'utf-8' });
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
process('FloatingTextFormatToolbarPlugin/index.tsx');
