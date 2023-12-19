import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import * as React from 'react';
import { useMemo, useState } from 'react';

import { useCharacterLimit } from './shared/useCharacterLimit';

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

function utf8Length(text: string) {
	const currentTextEncoder = textEncoder();

	if (currentTextEncoder === null) {
		// http://stackoverflow.com/a/5515960/210370
		const m = encodeURIComponent(text).match(/%[89ABab]/g);
		return text.length + (m ? m.length : 0);
	}

	return currentTextEncoder.encode(text).length;
}
