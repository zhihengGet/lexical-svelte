import type { SvelteRender } from '@lexical/react/types';
import CodeActionMenuContainerSvelte from './CodeActionMenuContainer.svelte';
export { default as CopyButton } from './components/CopyButton/index.svelte';
export {
	default as PrettierButton,
	canBePrettier
} from './components/PrettierButton/PrettierButton.svelte';
export default function CodeActionMenuPlugin({
	anchorElem = document.body
}: {
	anchorElem?: HTMLElement;
}): SvelteRender | null {
	return {
		component: CodeActionMenuContainerSvelte, // will handle rendering
		props: { anchorElem },
		portal: false,
		target: null
	};
}
