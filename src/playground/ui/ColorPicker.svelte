<script lang="ts">
	import './ColorPicker.css';

	import { useEffect, useMemo, useRef, useState } from 'react';

	import TextInput from './TextInput.svelte';
	import MoveWrapper from './MoveWrapper.svelte';
	import { styleString } from '../utils/css';
	import { untrack } from 'svelte';

	interface ColorPickerProps {
		color: string;
		onChange?: (color: string) => void;
	}

	const basicColors = [
		'#d0021b',
		'#f5a623',
		'#f8e71c',
		'#8b572a',
		'#7ed321',
		'#417505',
		'#bd10e0',
		'#9013fe',
		'#4a90e2',
		'#50e3c2',
		'#b8e986',
		'#000000',
		'#4a4a4a',
		'#9b9b9b',
		'#ffffff'
	];

	const WIDTH = 214;
	const HEIGHT = 150;
	let { color, onChange } = $props<Readonly<ColorPickerProps>>();

	const [selfColor, setSelfColor] = useState(transformColor('hex', color));
	const [inputColor, setInputColor] = useState(color);
	const innerDivRef = useRef(null);

	const saturationPosition = $derived({
		x: (selfColor().hsv.s / 100) * WIDTH,
		y: ((100 - selfColor().hsv.v) / 100) * HEIGHT
	});

	const huePosition = $derived({
		x: (selfColor().hsv.h / 360) * WIDTH
	});

	const onSetHex = (hex: string) => {
		setInputColor(hex);
		if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
			const newColor = transformColor('hex', hex);
			setSelfColor(newColor);
		}
	};
	interface Position {
		x: number;
		y: number;
	}

	const onMoveSaturation = ({ x, y }: Position) => {
		const newHsv = {
			...selfColor().hsv,
			s: (x / WIDTH) * 100,
			v: 100 - (y / HEIGHT) * 100
		};
		const newColor = transformColor('hsv', newHsv);
		setSelfColor(newColor);
		setInputColor(newColor.hex);
	};

	const onMoveHue = ({ x }: Position) => {
		const newHsv = { ...selfColor().hsv, h: (x / WIDTH) * 360 };
		const newColor = transformColor('hsv', newHsv);

		setSelfColor(newColor);
		setInputColor(newColor.hex);
	};

	useEffect(() => {
		// Check if the dropdown is actually active
		if (innerDivRef.current !== null && onChange) {
			console.log('calling useEFFECTt 90');
			onChange(selfColor().hex);
			setInputColor(selfColor().hex);
		}
	}, [selfColor, onChange]);

	useEffect(() => {
		if (color === undefined) return;
		console.log('🚀 ~ file: ColorPicker.svelte:99 ~ useEffect ~ color:', color);
		const newColor = transformColor('hex', color);
		untrack(() => {
			setSelfColor(newColor);
			setInputColor(newColor.hex);
		});
	}, [color]);

	interface RGB {
		b: number;
		g: number;
		r: number;
	}
	interface HSV {
		h: number;
		s: number;
		v: number;
	}
	interface Color {
		hex: string;
		hsv: HSV;
		rgb: RGB;
	}

	export function toHex(value: string): string {
		if (!value.startsWith('#')) {
			const ctx = document.createElement('canvas').getContext('2d');

			if (!ctx) {
				throw new Error('2d context not supported or canvas already initialized');
			}

			ctx.fillStyle = value;

			return ctx.fillStyle;
		} else if (value.length === 4 || value.length === 5) {
			value = value
				.split('')
				.map((v, i) => (i ? v + v : '#'))
				.join('');

			return value;
		} else if (value.length === 7 || value.length === 9) {
			return value;
		}

		return '#000000';
	}

	function hex2rgb(hex: string): RGB {
		const rbgArr = (
			hex
				.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
				.substring(1)
				.match(/.{2}/g) || []
		).map((x) => parseInt(x, 16));

		return {
			b: rbgArr[2],
			g: rbgArr[1],
			r: rbgArr[0]
		};
	}

	function rgb2hsv({ r, g, b }: RGB): HSV {
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const d = max - Math.min(r, g, b);

		const h = d
			? (max === r
					? (g - b) / d + (g < b ? 6 : 0)
					: max === g
						? 2 + (b - r) / d
						: 4 + (r - g) / d) * 60
			: 0;
		const s = max ? (d / max) * 100 : 0;
		const v = max * 100;

		return { h, s, v };
	}

	function hsv2rgb({ h, s, v }: HSV): RGB {
		s /= 100;
		v /= 100;

		const i = ~~(h / 60);
		const f = h / 60 - i;
		const p = v * (1 - s);
		const q = v * (1 - s * f);
		const t = v * (1 - s * (1 - f));
		const index = i % 6;

		const r = Math.round([v, q, p, p, t, v][index] * 255);
		const g = Math.round([t, v, v, q, p, p][index] * 255);
		const b = Math.round([p, p, t, v, v, q][index] * 255);

		return { b, g, r };
	}

	function rgb2hex({ b, g, r }: RGB): string {
		return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
	}

	function transformColor<M extends keyof Color, C extends Color[M]>(format: M, color: C): Color {
		let hex: Color['hex'] = toHex('#121212');
		let rgb: Color['rgb'] = hex2rgb(hex);
		let hsv: Color['hsv'] = rgb2hsv(rgb);

		if (format === 'hex') {
			const value = color as Color['hex'];

			hex = toHex(value);
			rgb = hex2rgb(hex);
			hsv = rgb2hsv(rgb);
		} else if (format === 'rgb') {
			const value = color as Color['rgb'];

			rgb = value;
			hex = rgb2hex(rgb);
			hsv = rgb2hsv(rgb);
		} else if (format === 'hsv') {
			const value = color as Color['hsv'];

			hsv = value;
			rgb = hsv2rgb(hsv);
			hex = rgb2hex(rgb);
		}

		return { hex, hsv, rgb };
	}
	import ColorPicker from 'svelte-awesome-color-picker';
</script>

<!-- 
<ColorPicker
	on:input={({ detail: { hex } }) => onChange?.(hex)}
	hex={color}
	isDialog={false}
	nullable
	--picker-height="100px"
	--picker-width="100px"
	--slider-width="25px"
	--picker-indicator-size="25px"
	--picker-z-index="10"
	--input-size="100px"
	--focus-color="green"
/> -->

<div class="color-picker-wrapper" style={'width:' + WIDTH + 'px'} bind:this={innerDivRef.current}>
	<TextInput label="Hex" onChange={onSetHex} value={inputColor()} />
	<div class="color-picker-basic-color">
		{#each basicColors as basicColor (basicColor)}
			<button
				class={basicColor === selfColor().hex ? ' active' : ''}
				style="background-color:{basicColor}"
				onclick={() => {
					setInputColor(basicColor);
					setSelfColor(transformColor('hex', basicColor));
				}}
			/>
		{/each}
	</div>
	<MoveWrapper
		class="color-picker-saturation"
		style="background-color: hsl({selfColor().hsv.h}, 100%, 50%)"
		onChange={onMoveSaturation}
	>
		<div
			class="color-picker-saturation_cursor"
			style={styleString({
				'background-color': selfColor().hex,
				left: saturationPosition.x,
				top: saturationPosition.y
			})}
		/>
	</MoveWrapper>
	<MoveWrapper class="color-picker-hue" onChange={onMoveHue}>
		<div
			class="color-picker-hue_cursor"
			style={styleString({
				'background-color': `hsl(${selfColor().hsv.h}, 100%, 50%)`,
				left: huePosition.x
			})}
		/>
	</MoveWrapper>
	<div class="color-picker-color" style="background-color: {selfColor().hex} " />
</div>
