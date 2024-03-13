<script>
	import Lazy from './Lazy.svelte';
	let setting = $state({ isAutocomplete: true, config: { editable: true } });
</script>

<button
	on:click={() => {
		setting.isAutocomplete = !setting.isAutocomplete;
		setting.config.editable = !setting.config.editable;
	}}>toggle</button
>
<Lazy {...setting} />
