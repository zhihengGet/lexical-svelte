<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';

	import { useDecorators } from '../shared/useDecorators.svelte';
	import { usePlainTextSetup } from '../shared/usePlainTextSetup.svelte';
	import Placeholder from './placeholder.svelte';
	import Portal from '@ui/Portal.svelte';
	import type { ComponentType, SvelteComponent } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let { contentEditable, placeholder, contentEditableProps, placeholderProps } = $props<{
		contentEditable: ComponentType<SvelteComponent>;
		placeholder: string;
		contentEditableProps?: HTMLAttributes<any>;
		placeholderProps?: HTMLAttributes<any>;
	}>();

	const [editor] = useLexicalComposerContext();
	let fn = useDecorators(editor);
	usePlainTextSetup(editor);
</script>

<svelte:component this={contentEditable} {...contentEditableProps} />
<Portal components={fn()} target={null} />
<Placeholder {...placeholderProps} content={placeholder} />
