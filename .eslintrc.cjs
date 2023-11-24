/** @type { import("eslint").Linter.FlatConfig } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	rules: {
		'@typescript-eslint/consistent-type-imports': 'error'
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
// customRule.js
const rename$ = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Description of the rule'
		},
		fixable: 'code',
		schema: [] // no options
	},
	create: function (context) {
		return {
			Identifier: () => {}
			// callback functions
		};
	}
};

const plugin = { rules: { 'enforce-dollar-sign': rename$ } };
module.exports = plugin;
