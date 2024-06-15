<script>
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import useLexicalEditable from '@lexical/react/useLexicalEditable.svelte';
	import Portal from '@ui/Portal.svelte';
	import TableCellResizer from './TableCellResizer.svelte';

	const [editor] = useLexicalComposerContext();
	const isEditable = useLexicalEditable();
</script>

<Portal
	enable={true}
	target={typeof document !== 'undefined' ? document.body : undefined}
	portal={true}
>
	<TableCellResizer {editor} />
</Portal>
