<script>
	import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin.svelte';

	import { validateUrl } from '../../utils/url';
	LexicalLinkPlugin({ validateUrl });
</script>
