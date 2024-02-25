<script lang="ts">
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	import { useEffect, useMemo, useRef, useState } from 'react';
	import type { Snippet } from 'svelte';
	const dropDownPadding = 4;

	let {
		disabled = false,
		buttonLabel,
		buttonAriaLabel,
		buttonClassName,
		buttonIconClassName,
		stopCloseOnClickSelf,
		children
	} = $props<{
		children?: Snippet;
		disabled?: boolean;
		buttonAriaLabel?: string;
		buttonClassName: string;
		buttonIconClassName?: string;
		buttonLabel?: string;
		stopCloseOnClickSelf?: boolean;
	}>();

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		><button
			type="button"
			{disabled}
			aria-label={buttonAriaLabel || buttonLabel}
			class={buttonClassName}
		>
			{#if buttonIconClassName}
				<span class={buttonIconClassName} />
			{/if}

			{#if buttonLabel}
				<span class="text-sm text-center">{buttonLabel}</span>
			{/if}
			<i class="chevron-down" />
		</button></DropdownMenu.Trigger
	>
	<DropdownMenu.Content class="bg-neutral-100">
		<DropdownMenu.Group>
			<DropdownMenu.Label><slot name="group" /></DropdownMenu.Label>
			<DropdownMenu.Separator />
			<slot />
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
