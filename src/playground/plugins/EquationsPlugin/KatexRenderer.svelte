<script lang="ts">
	import katex from 'katex';
	import * as React from 'react';
	import { useEffect, useRef } from 'react';

	type CommandPayload = Readonly<{
		equation: string;
		inline: boolean;
		onDoubleClick: () => void;
	}>;
	let { equation, inline, onDoubleClick }: CommandPayload = $props();
	const katexElementRef = useRef(null);

	$effect(() => {
		const katexElement = katexElementRef.current;
		if (katexElement !== null) {
			katex.render(equation, katexElement, {
				displayMode: !inline, // true === block display //
				errorColor: '#cc0000',
				output: 'html',
				strict: 'warn',
				throwOnError: false,
				trust: false
			});
		}
	});
</script>

<img src="#" alt="" />
<span role="button" tabIndex={-1} ondblclick={onDoubleClick} bind:this={katexElementRef.current}
></span>
<img src="#" alt="" />
