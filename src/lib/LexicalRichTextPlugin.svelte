<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';

	import Portal from '@ui/Portal.svelte';
	import type { Snippet } from 'svelte';
	import { useRichTextSetup } from '../shared/useRichTextSetup.svelte';
	import Placeholder from './placeholder.svelte';
	import { useDecorators } from '@shared/useDecorators.svelte';
	let { contentEditable, placeholder, contentEditableProps, placeholderProps } = $props<{
		contentEditable: Snippet;
		placeholder: string;
		contentEditableProps?: any;
		placeholderProps?: any;
	}>();
	const [editor] = useLexicalComposerContext();
	const decorators = useDecorators(editor);
	useRichTextSetup(editor);
	//console.log('setting update rich text editor', editor);
</script>

<Portal snippet={contentEditable} props={contentEditableProps} portal={false} target={null} />

<Placeholder content={placeholder} {...placeholderProps} />

<!-- <Portal components={decorators()} portal={false} target={null} />
 -->
