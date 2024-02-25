<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';
	import { flyAndScale } from '..//utils/css';
	import { X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	type temp = {
		closeOnClickOutside?: boolean;
		onClose?: () => void;
		title: string;
		children?: Snippet;
		open: boolean;
	};
	let { title: t, onClose, children, open } = $props<temp>();

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open: open1 }
	} = createDialog({
		defaultOpen: true,
		closeOnOutsideClick: false
	});

	$effect(() => {
		console.log('binded', open, $open1);
		open1.set(open);
		open1.subscribe((v) => (open = v));
	});
</script>

<!-- is dialog {$open1}
{open} -->
<div class="z-100">
	{#if open}
		<div
			{...$overlay}
			use:overlay
			class="fixed inset-0 z-50 bg-black/50"
			transition:fade={{ duration: 150 }}
		/>

		<div
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
            max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white
            p-6 shadow-lg"
			transition:flyAndScale={{
				duration: 150,
				y: 8,
				start: 0.96
			}}
			{...$content}
			use:content
		>
			<h1>{t}</h1>

			<slot />
			<!-- <X class="square-4" /> -->
			<button
				{...$close}
				use:close
				aria-label="close"
				class="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none
                items-center justify-center rounded-full p-1 text-magnum-800
                hover:bg-magnum-100 focus:shadow-magnum-400"
				>X
			</button>
		</div>
	{/if}
</div>
