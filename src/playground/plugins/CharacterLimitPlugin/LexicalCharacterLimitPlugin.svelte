<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import * as React from 'react';
	import { useMemo, useState } from 'react';

	import { useCharacterLimit } from './useCharacterLimit.svelte';

	const CHARACTER_LIMIT = 5;
	let textEncoderInstance: null | TextEncoder = null;

	function textEncoder(): null | TextEncoder {
		if (window.TextEncoder === undefined) {
			return null;
		}

		if (textEncoderInstance === null) {
			textEncoderInstance = new window.TextEncoder();
		}

		return textEncoderInstance;
	}
	type props = {
		charset: 'UTF-8' | 'UTF-16';
		maxLength: number;
	};
	let { charset, maxLength } = $props<props>();
	function utf8Length(text: string) {
		const currentTextEncoder = textEncoder();

		if (currentTextEncoder === null) {
			// http://stackoverflow.com/a/5515960/210370
			const m = encodeURIComponent(text).match(/%[89ABab]/g);
			return text.length + (m ? m.length : 0);
		}

		return currentTextEncoder.encode(text).length;
	}
	const [editor] = useLexicalComposerContext();

	const [remainingCharacters, setRemainingCharacters] = useState<string>(maxLength + '');

	const characterLimitProps = useMemo(
		() => ({
			remainingCharacters: setRemainingCharacters,
			strlen: (text: string) => {
				if (charset === 'UTF-8') {
					return utf8Length(text);
				} else if (charset === 'UTF-16') {
					return text.length;
				} else {
					throw new Error('Unrecognized charset');
				}
			}
		}),
		[charset]
	);

	useCharacterLimit(editor, maxLength, characterLimitProps);
</script>

<span class={`characters-limit ${remainingCharacters() < 0 ? 'characters-limit-exceeded' : ''}`}>
	{' '}
	{remainingCharacters()}
</span>
