<script lang="ts">
	import { default as PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin.svelte';

	import useLexicalEditable from '@lexical/react/useLexicalEditable.svelte';
	import { CAN_USE_DOM } from 'shared/canUseDOM';
	import LexicalContentEditable from './lib/LexicalContentEditable.svelte';
	import { useState } from './react.svelte';
	import LexicalTreeView from './lib/LexicalTreeView.svelte';
	import TreeViewPlugin from './playground/plugins/TreeViewPlugin/TreeViewPlugin.svelte';
	import ContentEditable from './playground/ui/ContentEditable.svelte';
	import { useSettings } from './playground/appSettings';
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
	import ImagePlugin from '@plugins/ImagesPlugin/ImagePlugin.svelte';
	import { useLexicalComposerContext } from './lib/LexicalComposerContext.svelte';
	import { AutoFocusPlugin } from './playground/plugins/AutoFocus/LexicalAutoFocusPlugin.svelte';
	import PageBreakPlug from '@plugins/PageBreakPlugin/PageBreakPlug.svelte';
	import { HorizontalRulePlugin } from '@plugins/HorizontalPlugin/LexicalHorizontalRulePlugin';
	import CollapsiblePlugin from '@plugins/CollapsiblePlugin/CollapsiblePlugin.svelte';
	import EquationsPlugin from '@plugins/EquationsPlugin/EquationsPlugin.svelte';
	import { HashtagPlugin } from './lib/LexicalHashtagPlugin';
	import AutocompletePlugin from '@plugins/AutocompletePlugin/AutocompletePlugin.svelte';
	import LexicalCharacterLimitPlugin from '@plugins/CharacterLimitPlugin/LexicalCharacterLimitPlugin.svelte';
	import { MaxLengthPlugin } from '@plugins/MaxLengthPlugin/MaxLengthPlugin.svelte';
	import { MaxByteDancePlugin } from '@plugins/MaxSizePlugin/MaxMBPlugin.svelte';
	import TableOfContentsPlugin from '@plugins/TableOfContentsPlugin/TableOfContentsPlugin.svelte';
	import MeltTree from '@plugins/TableOfContentsPlugin/MeltTree.svelte';
	import { UNDO_COMMAND } from 'lexical';
	import DraggableBlock from '@plugins/DraggableBlockPlugin/DraggableBlock.svelte';
	const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
	const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
	const isEditable = true;
	const text = 'Enter some plain text...';
	const placeholder = text;
	const skipCollaborationInit =
		// @ts-ignore
		window.parent != null && window.parent.frames.right === window;

	const settings = useSettings();
	$inspect('setting change', settings());
	const {
		isCollab,
		isAutocomplete,
		isMaxLength,
		isCharLimit,
		isCharLimitUtf8,
		isRichText,
		showTreeView,
		showTableOfContents,
		showToolbar,
		maxLength,
		image,
		onSizeLimit,
		config: { query }
	} = $derived(settings());
	$effect(() => {
		console.log('setting change', isAutocomplete);
	});
	//console.log('setting', isRichText, showTreeView);
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
	const [editor] = useLexicalComposerContext();
	//console.log('isRichText', isRichText);
	let container = $state<HTMLDivElement>();
	/* 	$effect(() => {
		container?.addEventListener('keydown', (v) => {
			console.log('keydown');
			if (v.ctrlKey && v.key == 'z') {
				editor.dispatchCommand(UNDO_COMMAND, undefined);
			}
		});

	}); */
	// your script goes here
	/* 	AutocompletePlugin({
		query: query
	}); */
</script>

{#snippet contentEditableRichText()}
	<div class="editor-scroller">
		<div class="editor" use:onRef>
			<ContentEditable />
		</div>
	</div>
{/snippet}

<!-- {isRichText ? 'RichTExt' : 'Plain'} -->
{#if showToolbar}
	<ToolbarPlugin {setIsLinkEditMode} />
{/if}
<div
	class={`editor-container ${showTreeView ? 'tree-view' : ''} ${!isRichText ? 'plain-text' : ''}`}
>
	{#if isRichText}
		<LexicalRichTextPlugin contentEditable={contentEditableRichText} {placeholder} />
		<PageBreakPlug />
		{#if image}
			<ImagePlugin captionsEnabled={true} />
		{/if}
		<Portal initializor={HorizontalRulePlugin} />
		<Portal initializor={CollapsiblePlugin} />
		<Portal initializor={AutoFocusPlugin} />
		<Portal initializor={ListPlugin} />
		<Portal initializor={CheckListPlugin} />
		<Portal initializor={CodeHighlightPlugin} />
		<Portal initializor={HashtagPlugin} />
		<!-- <Portal initializor={() => MaxLengthPlugin({ maxLength: maxLength })} /> -->

		{#if isMaxLength}
			<Portal
				initializor={() =>
					MaxByteDancePlugin({
						maxLength: maxLength,
						maxMB: 1,
						onMaxLimit: onSizeLimit
					})}
			/>
		{/if}
		<!-- 	{#if isAutocomplete}
			<Portal
				initializor={() =>
					AutocompletePlugin({
						query: query
					})}
			/>
		{/if} -->
		{#if isCharLimit || isCharLimitUtf8}
			<LexicalCharacterLimitPlugin charset="UTF-8" {maxLength} />
		{/if}

		<EquationsPlugin />
		<LinkPlugin />

		{@const el = floatingAnchorElem()}
		{#if el && isEditable}
			<Portal {...CodeActionMenuPlugin({ anchorElem: el })} />
			<FloatingLinkEditorPlugin
				anchorElem={el}
				isLinkEditMode={isLinkEditMode()}
				{setIsLinkEditMode}
			/>
			<Portal
				component={DraggableBlock}
				target={el}
				props={{ editor: editor, isEditable: editor._editable, anchorElem: el }}
			/>
			<FloatingTextFormatToolbarPlugin anchorElem={el} />
		{/if}
	{:else}
		<!-- plain text only -->
		<PlainTextPlugin contentEditable={ContentEditable} {placeholder} />

		<!-- enable history plugin  -->
		<Portal
			target={null}
			portal={false}
			initializor={() => HistoryPlugin({ externalHistoryState: historyState })}
		/>
	{/if}
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
	<!-- 	<TableOfContentsPlugin /> -->
	<!-- <Test /> -->
	<!-- 	<MeltTree /> -->
</div>

<!-- {#if settings().showTreeView}
	<TreeViewPlugin />
{/if}
 -->
