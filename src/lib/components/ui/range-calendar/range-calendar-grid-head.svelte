<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = RangeCalendarPrimitive.GridHeadProps;

	interface Props {
		class?: $$Props["class"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<RangeCalendarPrimitive.GridHead class={cn(className)} {...rest}>
	{@render children?.()}
</RangeCalendarPrimitive.GridHead>
