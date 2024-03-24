<script context="module" lang="ts">
	export type InsertImagePayload = Readonly<ImagePayload>;
	import { useState } from 'react';

	import Button from '@ui/Button.svelte';
	import { default as DialogActions } from '@ui/DialogActions.svelte';
	import TextInput from '@ui/TextInput.svelte';
	import type { ImagePayload } from './ImageNode';
</script>

<script lang="ts">
	const [src, setSrc] = useState('');
	const [altText, setAltText] = useState('');

	const isDisabled = $derived(src() === '');
	let {
		onClick
	}: {
		onClick: (payload: InsertImagePayload) => void;
	} = $props();
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
		disabled={src() === ''}
		onClick={() => onClick({ altText: altText(), src: src() })}
	>
		Confirm
	</Button>
</DialogActions>
