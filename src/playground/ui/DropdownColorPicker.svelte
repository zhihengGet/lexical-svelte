<script context="module" lang="ts">
</script>

<script lang="ts">
	import ColorPicker from './ColorPicker.svelte';
	import DropDown from '@ui/Dropdown/DropDown.svelte';

	type Props = {
		disabled?: boolean;
		buttonAriaLabel?: string;
		buttonClassName: string;
		buttonIconClassName?: string;
		buttonLabel?: string;
		title?: string;
		stopCloseOnClickSelf?: boolean;
		color: string;
		onChange?: (color: string) => void;
	};

	let { disabled = false, stopCloseOnClickSelf = true, color, onChange, ...rest } = $props<Props>();
</script>

<DropDown {...rest} {disabled} {stopCloseOnClickSelf}>
	<ColorPicker {color} {onChange} />
</DropDown>
