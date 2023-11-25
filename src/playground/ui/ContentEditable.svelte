<script lang="ts">
	import './ContentEditable.css';

	import ContentEditable from '@lexical/react/LexicalContentEditable.svelte';

	let { className, class: cl = '' } = $props<{ className?: string; class?: string }>();
</script>

<ContentEditable class={className + ' ' + cl || 'ContentEditable__root'} />
