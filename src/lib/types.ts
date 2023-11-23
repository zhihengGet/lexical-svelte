export type LexicalSubscription<T> = {
	initialValueFn: () => T;
	subscribe: (callback: (value: T) => void) => () => void;
};

export type SvelteRender = Partial<{
	component?: any | null;
	childComponents: SvelteRender[];
	childSnippet: any;
	snippet?: any;
	props?: any;
	nodeKey?: string;
	type?: string;
	key?: string;
	target: HTMLElement;
	ref: React.MutableRefObject<HTMLElement>;
	protal: boolean;
}>;
