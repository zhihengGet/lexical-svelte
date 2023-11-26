<script lang="ts">
	let { children, label, ...other } = $props<{ class: string; label: string }>();
</script>

<div class="Input__wrapper">
	<label class="Input__label">{label}</label>
	<select {...other}>
		{@render children()}
	</select>
</div>
