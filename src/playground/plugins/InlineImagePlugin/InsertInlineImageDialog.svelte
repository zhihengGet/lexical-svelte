<script context="module" lang="ts">
	import type { Position } from './InlineImageNode.svelte';

	import '../../ui/Checkbox.css';

	import type { LexicalCommand, LexicalEditor } from 'lexical';
	import { createCommand } from 'lexical';
	import type * as React from 'react';
	import { useEffect, useRef, useState } from 'react';
	import { CAN_USE_DOM } from 'shared/canUseDOM';

	import type { InlineImagePayload } from './InlineImageNode.svelte';
	import Button from '@ui/Button.svelte';
	import DialogActions from '@ui/DialogActions.svelte';
	import FileInput from '@ui/FileInput.svelte';
	import Select from '@ui/Select.svelte';
	import TextInput from '@ui/TextInput.svelte';

	export type InsertInlineImagePayload = Readonly<InlineImagePayload>;

	export const INSERT_INLINE_IMAGE_COMMAND: LexicalCommand<InlineImagePayload> = createCommand(
		'INSERT_INLINE_IMAGE_COMMAND'
	);
</script>

<script lang="ts">
	type props = {
		activeEditor: LexicalEditor;
		onClose: () => void;
	};
	let { activeEditor, onClose } = $props<props>();
	const hasModifier = useRef(false);

	const [src, setSrc] = useState('');
	const [altText, setAltText] = useState('');
	const [showCaption, setShowCaption] = useState(false);
	const [position, setPosition] = useState<Position>('left');

	const isDisabled = src() === '';

	const handleShowCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShowCaption(e.target.checked);
	};

	const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPosition(e.target.value as Position);
	};

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

	useEffect(() => {
		hasModifier.current = false;
		const handler = (e: KeyboardEvent) => {
			hasModifier.current = e.altKey;
		};
		document.addEventListener('keydown', handler);
		return () => {
			document.removeEventListener('keydown', handler);
		};
	}, [activeEditor]);

	const handleOnClick = () => {
		const payload = { altText: altText(), position, showCaption, src };
		activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload);
		onClose();
	};
</script>

<div class="mb-[1em]">
	<FileInput
		label="Image Upload"
		onChange={loadImage}
		accept="image/*"
		data-test-id="image-modal-file-upload"
	/>
</div>
<div class="mb-[1em]">
	<TextInput
		label="Alt Text"
		placeholder="Descriptive alternative text"
		onChange={setAltText}
		value={altText()}
		data-test-id="image-modal-alt-text-input"
	/>
</div>

<Select
	label="Position"
	class="mb-[1em] w-[290px]"
	name="position"
	id="position-select"
	onChange={handlePositionChange}
>
	<option value="left">Left</option>
	<option value="right">Right</option>
	<option value="full">Full Width</option>
</Select>

<div class="Input__wrapper">
	<input id="caption" type="checkbox" checked={showCaption()} onChange={handleShowCaptionChange} />
	<label for="caption">Show Caption</label>
</div>

<DialogActions>
	<Button
		data-test-id="image-modal-file-upload-btn"
		disabled={isDisabled}
		onClick={() => handleOnClick()}
	>
		Confirm
	</Button>
</DialogActions>
