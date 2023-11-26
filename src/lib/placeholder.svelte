<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import useLexicalEditable from '@lexical/react/useLexicalEditable.svelte';

	import { useCanShowPlaceholder } from '../shared/useCanShowPlaceholder.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let { content, class: className } = $props<{
		content: string | ((editable: boolean) => string);
		class?: string | null | undefined;
	}>();
	const [editor] = useLexicalComposerContext();
	const showPlaceholder = useCanShowPlaceholder(editor);
	const editable = useLexicalEditable();
</script>

<div class={className || 'Placeholder__root'}>
	{#if typeof content === 'function'}
		{content(editable)}
	{:else if showPlaceholder()}
		{content ?? ''}
	{/if}
</div>

<style>
	.Placeholder__root {
		font-size: 15px;
		color: #999;
		overflow: hidden;
		position: absolute;
		text-overflow: ellipsis;
		top: 8px;
		left: 28px;
		right: 28px;
		user-select: none;
		white-space: nowrap;
		display: inline-block;
		pointer-events: none;
	}
	@media (max-width: 1025px) {
		.Placeholder__root {
			left: 8px;
		}
	}
</style>
