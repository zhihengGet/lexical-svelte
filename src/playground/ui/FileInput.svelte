<script lang="ts">
	import './Input.css';

	type Props = Readonly<{
		'data-test-id'?: string;
		accept?: string;
		label: string;
		onChange: (files: FileList | null) => void;
	}>;
	let { accept, label, onChange, 'data-test-id': dataTestId } = $props<Props>();
</script>

<div class="Input__wrapper">
	<label class="Input__label">{label}</label>
	<input
		type="file"
		{accept}
		class="Input__input"
		onkeypress={(e) => e.preventDefault()}
		onkeydown={(e) => e.preventDefault()}
		onchange={(e) => {
			e.preventDefault();
			onChange(e.target.files);
		}}
	/>
</div>
