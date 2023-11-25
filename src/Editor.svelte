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
	import { HistoryPlugin } from './lib/LexicalHistoryPlugin.svelte';
	import Portal from '@ui/Portal.svelte';
	import { useSharedHistoryContext } from './playground/context/SharedHistoryContext';
	import { CollaborationPlugin } from './lib/LexicalCollaborationPlugin.svelte';
	import { createWebsocketProvider } from './playground/collaboration';
	import LexicalRichTextPlugin from './lib/LexicalRichTextPlugin.svelte';
	import { ListPlugin } from '@plugins/ListPlugin/LexicalListPlugin.svelte';
	import { CheckListPlugin } from '@plugins/ListPlugin/LexicalCheckListPlugin.svelte';
	import CodeHighlightPlugin from '@plugins/CodeHighlightPlugin';
	import CodeActionMenuPlugin from '@plugins/CodeActionMenuPlugin';
	import { LinkPlugin } from '@plugins/LinkPlugin';
	import FloatingTextFormatToolbarPlugin from '@plugins/FloatingTextFormatToolbarPlugin/FloatingTextFormatToolbarPlugin.svelte';
	import FloatingLinkEditorPlugin from '@plugins/FloatingLinkEditorPlugin/FloatingLinkEditorPlugin.svelte';
	const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
	const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
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
	const { historyState } = useSharedHistoryContext();
	// get ref to rich text plugin
	const onRef = (_floatingAnchorElem: HTMLDivElement) => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem);
		}
	};
	console.log('isRichText', isRichText);
	// your script goes here
	$effect(() => console.log('float', floatingAnchorElem()));
</script>

{#snippet contentEditableRichText()}
	<div class="editor-scroller">
		<div class="editor" use:onRef>
			<ContentEditable />
		</div>
	</div>
{/snippet}
<ToolbarPlugin {setIsLinkEditMode} />
<div
	class={`editor-container ${showTreeView ? 'tree-view' : ''} ${!isRichText ? 'plain-text' : ''}`}
>
	{#if isRichText}
		{#if isCollab}
			<!-- enable history plugin  -->
			<Portal
				portal={false}
				target={null}
				initializor={() =>
					CollaborationPlugin({
						id: 'main',
						providerFactory: createWebsocketProvider,
						shouldBootstrap: !skipCollaborationInit
					})}
			/>
		{:else}
			<!-- enable history plugin  -->
			<Portal
				target={null}
				portal={false}
				initializor={() => HistoryPlugin({ externalHistoryState: historyState })}
			/>
		{/if}

		<!-- enable rich text -->
		<Portal target={null} initializor={ListPlugin} />
		<Portal target={null} initializor={CheckListPlugin} />
		<Portal target={null} initializor={CodeHighlightPlugin} />
		<Portal target={null} initializor={CodeHighlightPlugin} />
		<!-- Links -->
		<LinkPlugin />
		<!-- 	<FloatingLinkEditorPlugin /> -->

		<!-- Images -->
		{#if floatingAnchorElem()}
			<Portal {...CodeActionMenuPlugin({ anchorElem: floatingAnchorElem() })} />
			<FloatingLinkEditorPlugin
				anchorElem={floatingAnchorElem()}
				isLinkEditMode={isLinkEditMode()}
				{setIsLinkEditMode}
			/>
			<FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem()} />
		{/if}

		<!-- list -->
		<LexicalRichTextPlugin contentEditable={contentEditableRichText} {placeholder} />
	{:else}
		<!-- plain text only -->
		<PlainTextPlugin contentEditable={ContentEditable} {placeholder} />
		{#if !isCollab}
			<!-- enable history plugin  -->
			<Portal
				target={null}
				portal={false}
				initializor={() => HistoryPlugin({ externalHistoryState: historyState })}
			/>
		{/if}
	{/if}
	<TreeViewPlugin />
</div>
