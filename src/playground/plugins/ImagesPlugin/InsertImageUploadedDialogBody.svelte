<script module lang="ts">
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
	import { useSettings } from '../../appSettings';
	const [src, setSrc] = useState('');
	const [altText, setAltText] = useState('');
	let { onClick } = $props<{
		onClick: (payload: InsertImagePayload) => void;
	}>();
	const setting = useSettings();
	let preview = $state('');
	let isSaving = $state(false);
	let file: File = null;
	const loadImage = async (files: FileList | null) => {
		const reader = new FileReader();
		reader.onload = function () {
			if (typeof reader.result === 'string') {
				setSrc(reader.result);
			}
			isSaving = false;
			return '';
		};
		if (files !== null) {
			//isSaving = true;
			/* let url = await setting().config?.upload?.(files[0]);
			if (url) {
				setSrc(url);
				isSaving = false;
			} */
			file = files[0];
			//if(files[0].size <= 5000)
			let url = URL.createObjectURL(file);
			preview = url;
		}
	};
	async function upload() {
		if (!File || !setting().imageUpload) {
			alert('No File Uploaded');
			return;
		}
		isSaving = true;
		let url = await setting().config?.upload?.(file);
		if (url) {
			setSrc(url);
			onClick({ altText: altText(), src: src() });
			return true;
		}
		isSaving = false;
		return false;
	}
	const isDisabled = $derived(preview === '');
</script>

{#if isSaving}
	<div class=" text-neutral">Uploading Image...</div>
{/if}
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

<img src={preview} width="200" height="200" alt={'Preview'} class="border-1 border-amber mx-auto" />

<DialogActions>
	<Button disabled={isDisabled} onClick={() => upload()}>Confirm</Button>
</DialogActions>
