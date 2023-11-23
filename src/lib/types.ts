import type { ComponentType, SvelteComponent } from 'svelte';

export type LexicalSubscription<T> = {
	initialValueFn: () => T;
	subscribe: (callback: (value: T) => void) => () => void;
};

export type SvelteRender = {
	component?: ComponentType<SvelteComponent> | null;
	snippet?: any;
	props?: unknown;
	nodeKey?: string;
	type?: string;
	key?: string;
	target: HTMLElement | null;
	initializor?: () => unknown;
	// get a ref to the rendered component
	ref?: React.MutableRefObject<HTMLElement>;
	portal?: boolean;
	childComponents?: SvelteRender[]; // nested in current component
	components?: SvelteRender[] | null; // sibling components
};
