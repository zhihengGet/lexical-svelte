<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	type temp = {
		closeOnClickOutside?: boolean;
		onClose?: () => void;
		title: string;
		children?: Snippet;
		open: boolean;
	};
	let { title: t, onClose, children, open = $bindable(false) }: temp = $props();

	/* 	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open: open1 }
	} = createDialog({
		defaultOpen: true,
		closeOnOutsideClick: false
	}); */
	/* 
	$effect(() => {
		console.log('binded', open, $open1);
		open1.set(open);
		open1.subscribe((v) => (open = v));
	}); */
</script>

<Dialog.Root bind:open>
	<!-- 	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Edit Profile</Dialog.Trigger> -->
	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>{t}</Dialog.Title>
			<Dialog.Description>
				Make changes to your image here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			{@render children?.()}
		</div>
		<!-- 	<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer> -->
	</Dialog.Content>
</Dialog.Root>
