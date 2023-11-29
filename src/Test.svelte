<script>
	import { INSERT_IMAGE_COMMAND } from '@plugins/ImagesPlugin';
	import { useLexicalComposerContext } from './lib/LexicalComposerContext.svelte';
	import { onMount } from 'svelte';

	const [editor] = useLexicalComposerContext();
	/* 	onMount(() => {
		editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
			altText: 'Yellow flower in tilt shift lens',
			src: 'https://images.unsplash.com/photo-1682686581498-5e85c7228119?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		});
	}); */
</script>

<!-- <div>test</div>
 -->
