import fs from 'fs/promises';
import path from 'path';

const files = await fs.readdir('./dist', { recursive: true });
const alias = {
	'@nodes/*': 'src/playground/nodes/*',
	'@plugins/*': 'src/playground/plugins/*',
	'shared/*': 'src/utils/*',
	'@shared/*': 'src/shared/*',
	'@lexical/react/*': 'src/lib/*',
	'@theme/*': 'src/themes/*',
	'@ui/*': 'src/playground/ui/*',
	react: 'src/react.svelte.js'
};
const name = Object.keys(alias);
for (let x of files) {
	console.log(path.resolve('./dist/', x), x);
	const stat = await fs.lstat(path.resolve('./dist/', x));
	console.log(stat.isFile());
	if (!stat.isFile()) continue;
	const content = await fs.readFile(path.resolve('./dist/', x), { encoding: 'utf-8' });

	for (let a of name) {
	}
}
console.log(files);
