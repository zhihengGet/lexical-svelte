<script lang="ts">
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	import type { Snippet } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	const dropDownPadding = 4;
	let {
		group,
		children,
		disabled = false,
		buttonLabel,
		buttonAriaLabel,
		buttonClassName,
		buttonIconClassName,
		stopCloseOnClickSelf,
		chevronClass = ''
	} = $props<{
		children?: Snippet;
		disabled?: boolean;
		buttonAriaLabel?: string;
		buttonClassName: string;
		buttonIconClassName?: string;
		buttonLabel?: string;
		stopCloseOnClickSelf?: boolean;
		chevronClass?: string;
	}>();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonClassName} {disabled}>
		{#if buttonIconClassName}
			<span class={buttonIconClassName}></span>
		{/if}

		{#if buttonLabel}
			<span class="text-sm text-center">{buttonLabel}</span>
		{/if}
		<i class="chevron-down {chevronClass}"></i>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="bg-[#fff] dropdown">
		<DropdownMenu.Group>
			<DropdownMenu.Label>{@render group?.()}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			{@render children?.()}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<style>
	:global(.toolbar button:disabled) {
		opacity: 0.5;
	}
</style>
