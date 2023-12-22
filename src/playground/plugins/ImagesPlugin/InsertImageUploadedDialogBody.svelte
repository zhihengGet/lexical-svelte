<script context="module" lang="ts">
	export type InsertImagePayload = Readonly<ImagePayload>;

	const getDOMSelection = (targetWindow: Window | null): Selection | null =>
		CAN_USE_DOM ? (targetWindow || window).getSelection() : null;
</script>

<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { mergeRegister } from '@lexical/utils';
	import type { LexicalCommand } from 'lexical';
	import {
		COMMAND_PRIORITY_EDITOR,
		COMMAND_PRIORITY_HIGH,
		COMMAND_PRIORITY_LOW,
		createCommand
	} from 'lexical';
	import { useEffect, useRef, useState } from 'react';
	import { CAN_USE_DOM } from 'shared/canUseDOM';

	import type { ImagePayload } from './ImageNode';
	import { ImageNode } from './ImageNode';
	import Button from '@ui/Button.svelte';
	import { default as DialogActions } from '@ui/DialogActions.svelte';
	import FileInput from '@ui/FileInput.svelte';
	import TextInput from '@ui/TextInput.svelte';
	const [src, setSrc] = useState('');
	const [altText, setAltText] = useState('');
	let { onClick } = $props<{
		onClick: (payload: InsertImagePayload) => void;
	}>();
	const loadImage = (files: FileList | null) => {
		const reader = new FileReader();
		reader.onload = function () {
			if (typeof reader.result === 'string') {
				setSrc(reader.result);
			}
			return '';
		};
		if (files !== null) {
			reader.readAsDataURL(files[0]);
		}
	};
	const isDisabled = $derived(src() === '');
</script>

<FileInput
	label="Image Upload"
	onChange={loadImage}
	accept="image/*"
	data-test-id="image-modal-file-upload"
/>
<TextInput
	label="Alt Text"
	placeholder="Descriptive alternative text"
	onChange={setAltText}
	value={altText()}
	data-test-id="image-modal-alt-text-input"
/>
<DialogActions>
	<Button disabled={isDisabled} onClick={() => onClick({ altText: altText(), src: src() })}>
		Confirm
	</Button>
</DialogActions>
