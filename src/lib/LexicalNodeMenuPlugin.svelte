<script context="module" lang="ts">
	import type { MenuRenderFn, MenuResolution } from '../shared/LexicalMenu.svelte';

	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import type * as lexical from 'lexical';
	import {
		COMMAND_PRIORITY_LOW,
		type CommandListenerPriority,
		$getNodeByKey as getNodeByKey
	} from 'lexical';
	import { LexicalMenu, MenuOption, useMenuAnchorRef } from '../shared/LexicalMenu.svelte';
	import { tick } from 'svelte';
	import { useState } from '../react.svelte';
	export type NodeMenuPluginProps<TOption extends MenuOption> = {
		onSelectOption: (
			option: TOption,
			textNodeContainingQuery: lexical.TextNode | null,
			closeMenu: () => void,
			matchingString: string
		) => void;
		options: Array<TOption>;
		nodeKey: lexical.NodeKey | null;
		onClose?: () => void;
		onOpen?: (resolution: MenuResolution) => void;
		menuRenderFn: MenuRenderFn<TOption>;
		anchorClassName?: string;
		commandPriority?: CommandListenerPriority;
	};
	export { type MenuRenderFn, MenuOption, type MenuResolution };

	import { useCallback, useEffect } from 'react';
</script>

<script lang="ts">
	import Portal from '@ui/Portal.svelte';

	type TOption = $$Generic<MenuOption>;

	type prop = NodeMenuPluginProps<TOption>;
	function startTransition(callback: () => void) {
		tick().then(callback);
	}

	let {
		options,
		nodeKey,
		onClose,
		onOpen,
		onSelectOption,
		menuRenderFn,
		anchorClassName,
		commandPriority = COMMAND_PRIORITY_LOW
	} = $props<prop>();

	const [editor] = useLexicalComposerContext();
	const [resolution, setResolution] = useState<MenuResolution | null>(null);
	const anchorElementRef = useMenuAnchorRef(resolution(), setResolution, anchorClassName);

	const closeNodeMenu = useCallback(() => {
		setResolution(null);
		if (onClose != null && resolution !== null) {
			onClose();
		}
	}, [onClose, resolution]);

	const openNodeMenu = useCallback(
		(res: MenuResolution) => {
			setResolution(res);
			if (onOpen != null && resolution === null) {
				onOpen(res);
			}
		},
		[onOpen, resolution]
	);

	const positionOrCloseMenu = useCallback(() => {
		if (nodeKey) {
			editor.update(() => {
				const node = getNodeByKey(nodeKey);
				const domElement = editor.getElementByKey(nodeKey);
				if (node != null && domElement != null) {
					if (resolution == null) {
						startTransition(() =>
							openNodeMenu({
								getRect: () => domElement.getBoundingClientRect()
							})
						);
					}
				}
			});
		} else if (nodeKey == null && resolution != null) {
			closeNodeMenu();
		}
	}, [closeNodeMenu, editor, nodeKey, openNodeMenu, resolution]);

	useEffect(() => {
		positionOrCloseMenu();
	}, [positionOrCloseMenu, nodeKey]);

	useEffect(() => {
		if (nodeKey != null) {
			return editor.registerUpdateListener(({ dirtyElements }) => {
				if (dirtyElements.get(nodeKey)) {
					positionOrCloseMenu();
				}
			});
		}
	}, [editor, positionOrCloseMenu, nodeKey]);

	let component = LexicalMenu({
		close: closeNodeMenu,
		resolution: resolution(),
		editor: editor,
		anchorElementRef: anchorElementRef,
		options: options,
		menuRenderFn: menuRenderFn,
		onSelectOption: onSelectOption,
		commandPriority: commandPriority
	});
	export { MenuOption, MenuRenderFn, MenuResolution };
</script>

{#if resolution() !== null && editor != null}
	<Portal {...component} portal={false} />
{/if}
