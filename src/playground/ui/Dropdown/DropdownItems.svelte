<script lang="ts">
	import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
	import { getContext, setContext, type Snippet } from 'svelte';

	let { dropDownRef, onClose, children } = $props<{
		dropDownRef: any;
		children: Snippet;
		onClose: () => void;
	}>();
	const [items, setItems] = useState<React.RefObject<HTMLButtonElement>[]>(null);
	const [highlightedItem, setHighlightedItem] = useState<React.RefObject<HTMLButtonElement>>(null);

	const registerItem = useCallback(
		(itemRef: React.RefObject<HTMLButtonElement>) => {
			setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]));
		},
		[setItems]
	);

	const handleKeyDown = (event: KeyboardEvent) => {
		console.log('on close dropdwon', event.key);
		if (!items()) return;

		const key = event.key;

		if (['Escape', 'ArrowUp', 'ArrowDown', 'Tab'].includes(key)) {
			event.preventDefault();
		}

		if (key === 'Escape' || key === 'Tab') {
			onClose();
		} else if (key === 'ArrowUp') {
			setHighlightedItem((prev) => {
				if (!prev) return items()[0];
				const index = items().indexOf(prev) - 1;
				return items()[index === -1 ? items.length - 1 : index];
			});
		} else if (key === 'ArrowDown') {
			setHighlightedItem((prev) => {
				if (!prev) return items()[0];
				return items()[items().indexOf(prev) + 1];
			});
		}
	};

	const contextValue = useMemo(
		() => ({
			registerItem
		}),
		[registerItem]
	);
	setContext('dialog', contextValue);

	export const getDialogContext = () => {
		getContext('dialog') as typeof contextValue;
	};
	useEffect(() => {
		if (items() && !highlightedItem()) {
			setHighlightedItem(items()[0]);
		}

		if (highlightedItem() && highlightedItem().current) {
			highlightedItem().current?.focus();
		}
	}, [items, highlightedItem]);
</script>

<div class="dropdown" bind:this={dropDownRef.current} onkeydown={handleKeyDown}>
	<slot />
</div>
