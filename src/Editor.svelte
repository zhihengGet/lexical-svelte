<script lang="ts">
	import { default as PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin.svelte';

	import useLexicalEditable from '@lexical/react/useLexicalEditable.svelte';
	import { CAN_USE_DOM } from 'shared/canUseDOM';
	import LexicalContentEditable from './lib/LexicalContentEditable.svelte';
	import { useState } from './react.svelte';
	import LexicalTreeView from './lib/LexicalTreeView.svelte';
	import TreeViewPlugin from './playground/plugins/TreeViewPlugin/TreeViewPlugin.svelte';
	import ContentEditable from './playground/ui/ContentEditable.svelte';
	import SettingsContext, { useSettings } from './playground/context/SettingsContext.svelte';
	import ToolbarPlugin from '@plugins/ToolbarPlugin/ToolbarPlugin.svelte';
	const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
	const isEditable = true;
	const text = 'Enter some plain text...';
	const placeholder = text;
	const skipCollaborationInit =
		// @ts-ignore
		window.parent != null && window.parent.frames.right === window;

	const settings = useSettings();
	const {
		isCollab,
		isAutocomplete,
		isMaxLength,
		isCharLimit,
		isCharLimitUtf8,
		isRichText,
		showTreeView,
		showTableOfContents,
		shouldUseLexicalContextMenu,
		tableCellMerge,
		tableCellBackgroundColor
	} = settings.settings();
	console.log('setting', isRichText, showTreeView);
	$effect(() => {
		const updateViewPortWidth = () => {
			const isNextSmallWidthViewport =
				CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;
		};
		updateViewPortWidth();
		window.addEventListener('resize', updateViewPortWidth);

		return () => {
			window.removeEventListener('resize', updateViewPortWidth);
		};
	});

	// your script goes here
</script>

<ToolbarPlugin {setIsLinkEditMode} />
<div
	class={`editor-container ${showTreeView ? 'tree-view' : ''} ${!isRichText ? 'plain-text' : ''}`}
>
	<PlainTextPlugin contentEditable={ContentEditable} {placeholder} />
	<TreeViewPlugin />
</div>
