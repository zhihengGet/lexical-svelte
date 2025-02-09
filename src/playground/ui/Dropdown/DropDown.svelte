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
			<span class="pr-1 text-center text-sm">{buttonLabel}</span>
		{/if}
		<i class="chevron-down {chevronClass}"></i>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="dropdown max-h-[300px] overflow-y-auto bg-[#fff]">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading class="h-0"></DropdownMenu.GroupHeading>
			<!-- {#if group}
				<DropdownMenu.Label>{@render group?.()}</DropdownMenu.Label>
			{/if} -->
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
