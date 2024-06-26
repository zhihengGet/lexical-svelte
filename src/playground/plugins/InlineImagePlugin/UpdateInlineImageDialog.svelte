<script context="module" lang="ts">
	type CommandPayload = {
		equation: string;
		inline: boolean;
	};
	const imageCache = new Set();
	//TODO cache image
	export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> = lexical.createCommand(
		'RIGHT_CLICK_IMAGE_COMMAND'
	);
</script>

<script lang="ts">
	import type { LexicalCommand } from 'lexical';

	import './ImageNode.css';

	import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext.svelte';
	import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin.svelte';
	import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
	import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin.svelte';
	import * as lexical from 'lexical';
	import type * as React from 'react';
	import { useCallback, useEffect, useRef, useState } from 'react';

	import { createWebsocketProvider } from '../../collaboration';
	import { useSettings } from '../../context/SettingsContext.svelte';
	import EmojisPlugin from '../EmojisPlugin';
	import KeywordsPlugin from '../KeywordsPlugin';
	import { LinkPlugin } from '../LinkPlugin';
	// import MentionsPlugin from "../plugins/MentionsPlugin";
	//import TreeViewPlugin from "../../plugins/TreeViewPlugin.svelte";
	import ContentEditable from '@ui/ContentEditable.svelte';
	import ImageResizer from '../ImagesPlugin/ImageResizer.svelte';
	import { $isImageNode as isImageNode } from '../ImagesPlugin/ImageNode';
	import { useSharedHistoryContext } from '../../context/SharedHistoryContext';
	import {
		CLICK_COMMAND,
		COMMAND_PRIORITY_LOW,
		createCommand,
		DRAGSTART_COMMAND,
		KEY_BACKSPACE_COMMAND,
		KEY_DELETE_COMMAND,
		KEY_ENTER_COMMAND,
		KEY_ESCAPE_COMMAND,
		SELECTION_CHANGE_COMMAND
	} from 'lexical';
	import type { Position, InlineImageNode } from './InlineImageNode.svelte';
	import type {
		GridSelection,
		LexicalEditor,
		NodeKey,
		NodeSelection,
		RangeSelection
	} from 'lexical';

	import './InlineImageNode.css';

	import Button from '../ui/Button';
	import { DialogActions } from '../ui/Dialog';
	import Select from '@ui/Select.svelte';
	import TextInput from '@ui/TextInputsvelte';

	import type { ChangeEvent } from '../../../../react';
	let { activeEditor, nodeKey, onClose } = $props<{
		activeEditor: LexicalEditor;
		nodeKey: NodeKey;
		onClose: () => void;
	}>();
	const editorState = activeEditor.getEditorState();
	const node = editorState.read(() => $getNodeByKey(nodeKey) as InlineImageNode);
	const [altText, setAltText] = useState(node.getAltText());
	const [showCaption, setShowCaption] = useState(node.getShowCaption());
	const [position, setPosition] = useState<Position>(node.getPosition());

	const handleShowCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShowCaption(e.target.checked);
	};

	const handlePositionChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPosition(e.target.value as Position);
	};

	const handleOnConfirm = () => {
		const payload = { altText, position, showCaption };
		if (node) {
			activeEditor.update(() => {
				node.update(payload);
			});
		}
		onClose();
	};
</script>

<div {draggable}>
	<img
		class={isFocused ? `focused ${lexical.$isNodeSelection(selection) ? 'draggable' : ''}` : null}
		{src}
		alt={altText}
		bind:this={imageRef.current}
		{width}
		{height}
		style={'max-width:' + maxWidth}
	/>
</div>
<div style={{ marginBottom: '1em' }}>
	<TextInput
		label="Alt Text"
		placeholder="Descriptive alternative text"
		onChange={setAltText}
		value={altText}
		data-test-id="image-modal-alt-text-input"
	/>
</div>

<Select
	style={{ marginBottom: '1em', width: '208px' }}
	value={position}
	label="Position"
	name="position"
	id="position-select"
	onChange={handlePositionChange}
>
	<option value="left">Left</option>
	<option value="right">Right</option>
	<option value="full">Full Width</option>
</Select>

<div className="Input__wrapper">
	<input id="caption" type="checkbox" checked={showCaption} onChange={handleShowCaptionChange} />
	<label htmlFor="caption">Show Caption</label>
</div>

<DialogActions>
	<Button data-test-id="image-modal-file-upload-btn" onClick={() => handleOnConfirm()}>
		Confirm
	</Button>
</DialogActions>
