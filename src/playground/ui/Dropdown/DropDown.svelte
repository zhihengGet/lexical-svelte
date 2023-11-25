<script lang="ts">
	/**
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	import { useEffect, useMemo, useRef, useState } from 'react';
	import DropDownItems from './Items.svelte';
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

	const dropDownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [showDropDown, setShowDropDown] = useState(false);

	const handleClose = () => {
		setShowDropDown(false);
		if (buttonRef && buttonRef.current) {
			buttonRef.current.focus();
		}
	};

	useEffect(() => {
		const button = buttonRef.current;
		const dropDown = dropDownRef.current;

		if (showDropDown() && button !== null && dropDown !== null) {
			const { top, left } = button.getBoundingClientRect();
			dropDown.style.top = `${top + button.offsetHeight + dropDownPadding}px`;
			dropDown.style.left = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 20)}px`;
		}
	}, [dropDownRef, buttonRef, showDropDown()]);

	useEffect(() => {
		const button = buttonRef.current;

		if (button !== null && showDropDown()) {
			const handle = (event: MouseEvent) => {
				const target = event.target;
				if (stopCloseOnClickSelf) {
					if (dropDownRef.current && dropDownRef.current.contains(target as Node)) return;
				}
				if (!button.contains(target as Node)) {
					setShowDropDown(false);
				}
			};
			document.addEventListener('click', handle);

			return () => {
				document.removeEventListener('click', handle);
			};
		}
	}, [dropDownRef, buttonRef, showDropDown, stopCloseOnClickSelf]);

	useEffect(() => {
		const handleButtonPositionUpdate = () => {
			if (showDropDown()) {
				const button = buttonRef.current;
				const dropDown = dropDownRef.current;
				if (button !== null && dropDown !== null) {
					const { top } = button.getBoundingClientRect();
					const newPosition = top + button.offsetHeight + dropDownPadding;
					if (newPosition !== dropDown.getBoundingClientRect().top) {
						dropDown.style.top = `${newPosition}px`;
					}
				}
			}
		};

		document.addEventListener('scroll', handleButtonPositionUpdate);

		return () => {
			document.removeEventListener('scroll', handleButtonPositionUpdate);
		};
	}, [buttonRef, dropDownRef, showDropDown]);
</script>

<button
	type="button"
	{disabled}
	aria-label={buttonAriaLabel || buttonLabel}
	class={buttonClassName}
	onclick={() => setShowDropDown(!showDropDown())}
	bind:this={buttonRef.current}
>
	{#if buttonIconClassName}
		<span class={buttonIconClassName} />
	{/if}
	{#if buttonLabel}
		<span class="text dropdown-button-text">{buttonLabel}</span>
	{/if}
	<i class="chevron-down" />
</button>

{#if showDropDown()}
	<DropDownItems {dropDownRef} onClose={handleClose}>
		<slot />
	</DropDownItems>
{/if}
