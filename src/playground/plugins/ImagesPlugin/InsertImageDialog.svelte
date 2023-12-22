<script context="module" lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { $wrapNodeInElement as wrapNodeInElement, mergeRegister } from '@lexical/utils';
	import {
		$createParagraphNode as createParagraphNode,
		$createRangeSelection as createRangeSelection,
		$getSelection as getSelection,
		$insertNodes as insertNodes,
		$isNodeSelection as isNodeSelection,
		$isRootOrShadowRoot as isRootOrShadowRoot,
		$setSelection as setSelection,
		COMMAND_PRIORITY_EDITOR,
		COMMAND_PRIORITY_HIGH,
		COMMAND_PRIORITY_LOW,
		createCommand,
		DRAGOVER_COMMAND,
		DRAGSTART_COMMAND,
		DROP_COMMAND,
		type LexicalCommand,
		type LexicalEditor
	} from 'lexical';
	import { useEffect, useRef, useState } from 'react';
	import { CAN_USE_DOM } from 'shared/canUseDOM';

	import {
		$createImageNode as createImageNode,
		$isImageNode as isImageNode,
		ImageNode,
		type ImagePayload
	} from '@plugins/ImagesPlugin/ImageNode';
	import Button from '@ui/Button.svelte';
	import DialogButtonsList from '@ui/DialogButtonsList.svelte';

	export type InsertImagePayload = Readonly<ImagePayload>;

	const getDOMSelection = (targetWindow: Window | null): Selection | null =>
		CAN_USE_DOM ? (targetWindow || window).getSelection() : null;
</script>

<script lang="ts">
	import InsertImageUploadedDialogBody from './InsertImageUploadedDialogBody.svelte';
	import InsertImageUriDialogBody from './InsertImageUriDialogBody.svelte';
	import { INSERT_IMAGE_COMMAND } from '.';
	import { onMount } from 'svelte';
	const [mode, setMode] = useState<null | 'url' | 'file'>(null);
	const hasModifier = useRef(false);
	let { activeEditor, onClose } = $props<{
		activeEditor: LexicalEditor;
		onClose: () => void;
	}>();
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

	const onClick = (payload: InsertImagePayload) => {
		activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
		console.log(
			'🚀 ~ file: InsertImageDialog.svelte:65 ~ onClick ~ INSERT_IMAGE_COMMAND:',
			payload
		);

		onClose();
	};
</script>

{#if !mode()}
	<DialogButtonsList>
		<Button
			onClick={() =>
				onClick(
					hasModifier.current
						? {
								altText: 'Daylight fir trees forest glacier green high ice landscape',
								src: 'https://images.unsplash.com/photo-1682686581498-5e85c7228119?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
							}
						: {
								altText: 'Yellow flower in tilt shift lens',
								src: 'https://images.unsplash.com/photo-1682686581498-5e85c7228119?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
							}
				)}
		>
			Sample
		</Button>
		<Button onClick={() => setMode('url')}>URL</Button>
		<Button onClick={() => setMode('file')}>File</Button>
	</DialogButtonsList>
{/if}

{#if mode() === 'url'}
	<InsertImageUriDialogBody {onClick} />
{/if}

{#if mode() === 'file'}
	<InsertImageUploadedDialogBody {onClick} />
{/if}
