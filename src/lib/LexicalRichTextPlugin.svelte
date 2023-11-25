<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import useLexicalEditable from '@lexical/react/useLexicalEditable.svelte';

	import { useCanShowPlaceholder } from '../shared/useCanShowPlaceholder.svelte';
	import { useDecorators } from '../shared/useDecorators.svelte';
	import { useRichTextSetup } from '../shared/useRichTextSetup.svelte';
	import type { Snippet } from 'svelte';
	import Placeholder from './placeholder.svelte';
	import Portal from '@ui/Portal.svelte';

	let { contentEditable, placeholder, contentEditableProps, placeholderProps } = $props<{
		contentEditable: Snippet;
		placeholder: string;
		contentEditableProps?: any;
		placeholderProps?: any;
	}>();
	const [editor] = useLexicalComposerContext();
	const decorators = useDecorators(editor);
	useRichTextSetup(editor);
	$effect(() => console.log('decorators', decorators()));
</script>

<Portal snippet={contentEditable} props={contentEditableProps} portal={false} target={null} />

<Placeholder content={placeholder} {...placeholderProps} />

<Portal components={decorators()} portal={false} target={null} />
