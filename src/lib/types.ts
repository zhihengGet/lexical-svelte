import type { ComponentProps, Snippet } from 'svelte';

export type LexicalSubscription<T> = {
	initialValueFn: () => T;
	subscribe: (callback: (value: T) => void) => () => void;
};

export type SvelteRender<T = {}> = {
	component?: T | any | Promise<T>;
	snippet?: any;
	props?: ComponentProps<T>;
	nodeKey?: string;
	type?: string;
	key?: string;
	target?: HTMLElement | null;
	initializor?: () => unknown;
	// get a ref to the rendered component
	ref?: React.MutableRefObject<HTMLElement>;
	portal?: boolean;
	childComponents?: SvelteRender<any>[]; // nested in current component
	components?: SvelteRender<any>[] | null; // sibling components
	childSnippets?: Snippet[];
};
