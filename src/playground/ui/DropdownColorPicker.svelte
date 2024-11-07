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
		onChange?: (value: string, skipHistoryStack: boolean) => void;
	};

	let { disabled = false, stopCloseOnClickSelf = true, color, onChange, ...rest }: Props = $props();
</script>

<DropDown {...rest} {disabled}>
	<ColorPicker {color} {onChange} />
</DropDown>
