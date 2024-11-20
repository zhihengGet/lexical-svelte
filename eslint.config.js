import eslintPluginSvelte from 'eslint-plugin-svelte';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
	// add more generic rule sets here, such as:
	// js.configs.recommended,
	...eslintPluginSvelte.configs['flat/recommended'],
	{
		plugins: {
			'unused-imports': unusedImports
		},
		rules: {
			'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_'
				}
			]
		}
	}
];
