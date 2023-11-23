<script lang="ts">
	import LexicalAutoEmbedPlugin, {
		AutoEmbedOption
	} from '@lexical/react/LexicalAutoEmbedPlugin.svelte';
	import AutoEmbedDialog from './AutoEmbedDialog.svelte';
	import { EmbedConfigs, type PlaygroundEmbedConfig } from './index';
	import useModal from '../../hooks/useModal';
	import Portal from '@ui/Portal.svelte';
	import { styleString } from '../../utils/css';
	import AutoEmbedMenu from './AutoEmbedMenu.svelte';
	import type { SvelteRender } from '@lexical/react/types';
	import Modal from '@ui/Modal.svelte';
	const [modal, showModal] = useModal();

	const openEmbedModal = (embedConfig: PlaygroundEmbedConfig) => {
		showModal(`Embed ${embedConfig.contentName}`, (onClose) => {
			return { childSnippet: children };
		});
	};
	const getMenuOptions = (
		activeEmbedConfig: PlaygroundEmbedConfig,
		embedFn: () => void,
		dismissFn: () => void
	) => {
		return [
			new AutoEmbedOption('Dismiss', {
				onSelect: dismissFn
			}),
			new AutoEmbedOption(`Embed ${activeEmbedConfig.contentName}`, {
				onSelect: embedFn
			})
		];
	};
	const fn = (
		anchorElementRef: React.MutableRefObject<HTMLElement>,
		{ selectedIndex, options, selectOptionAndCleanUp, setHighlightedIndex }
	): SvelteRender => {
		return {
			component: AutoEmbedMenu,
			props: {
				options,
				selectedItemIndex: selectedIndex,
				onOptionClick: (option: AutoEmbedOption, index: number) => {
					setHighlightedIndex(index);
					selectOptionAndCleanUp(option);
				},
				onOptionMouseEnter: (index: number) => {
					setHighlightedIndex(index);
				}
			}
		};
	};
</script>

{#snippet children({ embedConfig, onClose })}
	<AutoEmbedDialog {embedConfig} {onClose} />
{/snippet}

<Portal {...model}></Portal>

{#snippet SnippetPortal( { children, ref, refFn, selectedIndex, options, selectOptionAndCleanUp, setHighlightedIndex, anchorElementRef } )}
	<div
		bind:this={ref}
		use:refFn
		class="typeahead-popover auto-embed-menu"
		style={styleString({
			marginLeft: anchorElementRef.current.style.width,
			width: 200
		})}
	>
		<AutoEmbedMenu
			{options}
			selectedItemIndex={selectedIndex}
			onOptionClick={(option, index) => {
				setHighlightedIndex(index);
				selectOptionAndCleanUp(option);
			}}
			onOptionMouseEnter={(index) => {
				setHighlightedIndex(index);
			}}
		/>
	</div>
{/snippet}

<Portal {...modal} />
<Portal snippet={SnippetPortal} />
<LexicalAutoEmbedPlugin
	embedConfigs={EmbedConfigs}
	onOpenEmbedModalForConfig={openEmbedModal}
	{getMenuOptions}
	menuRenderFn={fn}
/>
