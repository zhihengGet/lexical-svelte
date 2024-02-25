<script lang="ts">
	import './Input.css';

	import * as React from 'react';

	type Props = Readonly<{
		'data-test-id'?: string;
		label: string;
		onChange: (val: string) => void;
		placeholder?: string;
		value: string;
		type?: import('svelte/elements').HTMLInputTypeAttribute;
	}>;

	let {
		label,
		value,
		onChange,
		placeholder = '',
		'data-test-id': dataTestId,
		type = 'text'
	} = $props<Props>();
</script>

<div class="Input__wrapper">
	<label class="Input__label">{label}</label>
	<input
		{type}
		{value}
		tabindex="-1"
		class="Input__input"
		{placeholder}
		oninput={(e) => {
			onChange(e.target.value);
		}}
	/>
</div>
