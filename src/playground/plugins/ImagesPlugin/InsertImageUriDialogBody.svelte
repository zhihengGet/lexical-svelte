<script context="module" lang="ts">
	export type InsertImagePayload = Readonly<ImagePayload>;

	const getDOMSelection = (targetWindow: Window | null): Selection | null =>
		CAN_USE_DOM ? (targetWindow || window).getSelection() : null;

	export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
		createCommand('INSERT_IMAGE_COMMAND');
</script>

<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { mergeRegister } from '@lexical/utils';
	import {
		COMMAND_PRIORITY_EDITOR,
		COMMAND_PRIORITY_HIGH,
		COMMAND_PRIORITY_LOW,
		createCommand,
		DRAGOVER_COMMAND,
		DRAGSTART_COMMAND,
		DROP_COMMAND,
		LexicalCommand,
		LexicalEditor
	} from 'lexical';
	import { useEffect, useRef, useState } from 'react';

	import { CAN_USE_DOM } from 'shared/canUseDOM';

	import { ImageNode, ImagePayload } from './ImageNode';
	import Button from '@ui/Button.svelte';
	import { default as DialogActions } from '@ui/DialogActions.svelte';
	import FileInput from '@ui/FileInput.svelte';
	import TextInput from '@ui/TextInput.svelte';
	const [src, setSrc] = useState('');
	const [altText, setAltText] = useState('');

	const isDisabled = src() === '';
	let { onClick } = $props<{
		onClick: (payload: InsertImagePayload) => void;
	}>();
</script>

<TextInput
	label="Image URL"
	placeholder="i.e. https://source.unsplash.com/random"
	onChange={setSrc}
	value={src()}
	data-test-id="image-modal-url-input"
/>
<TextInput
	label="Alt Text"
	placeholder="Random unsplash image"
	onChange={setAltText}
	value={altText()}
	data-test-id="image-modal-alt-text-input"
/>
<DialogActions>
	<Button
		data-test-id="image-modal-confirm-btn"
		disabled={isDisabled}
		onClick={() => onClick({ altText: altText(), src: src() })}
	>
		Confirm
	</Button>
</DialogActions>
