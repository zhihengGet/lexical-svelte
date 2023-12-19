<script lang="ts" context="module">
	import './index.css';
</script>

<script lang="ts">
	import type { TableOfContentsEntry } from '.';
	import LexicalTableOfContents from './LexicalTableOfContents.svelte';
	import TableOfContentsList from './TableOfContentsList.svelte';

	type props = {
		tableOfContents: Array<TableOfContentsEntry>;
	};
	let { tableOfContents } = $props<props>();
</script>

<LexicalTableOfContents />
