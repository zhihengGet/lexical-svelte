import * as fs from 'fs';
import * as path from 'node:path';
import { glob } from 'glob';

const aliases = {
	$lib: './src/lib',
	shared: './src/util/src/',
	'@shared': './src/shared/',
	'@lexical/react/': './src/lib/',
	react: './src/react.svelte',
	'@theme/': './src/themes/',
	'@ui/': './src/playground/ui/',
	'@nodes/': './src/playground/nodes/',
	'@plugins/': './src/playground/plugins/'
};

async function resolveAliases() {
	try {
		// Find all JS/TS files in dist
		const files = await glob('dist/**/*.{js,ts,svelte}');

		for (const file of files) {
			let content = fs.readFileSync(file, 'utf-8');
			let modified = false;

			// Replace each alias with relative path
			for (const [alias, target] of Object.entries(aliases)) {
				const aliasRegex = new RegExp(`from ['"]${alias}([^'"]*?)['"]`, 'g');
				const currentDir = path.dirname(file);

				content = content.replace(aliasRegex, (match, importPath) => {
					modified = true;
					const targetPath = target.replace('./src/', './');
					const absoluteTarget = path.resolve(process.cwd(), targetPath);
					const relativeTarget = path.relative(currentDir, absoluteTarget);
					const normalizedPath = relativeTarget.replace(/\\/g, '/');
					return `from '${normalizedPath}${importPath}'`;
				});
			}

			// Only write if file was modified
			if (modified) {
				fs.writeFileSync(file, content);
				console.log(`Resolved aliases in: ${file}`);
			}
		}
	} catch (error) {
		console.error('Error resolving aliases:', error);
	}
}

resolveAliases();
