import { SvelteComponent } from "svelte";
import { MutableRefObject } from "../../react";
import { SnippetBlock } from "svelte/compiler";

export type LexicalSubscription<T> = {
  initialValueFn: () => T;
  subscribe: (callback: (value: T) => void) => () => void;
};

export type SvelteRender = Partial<{
  component?: any;
  childComponents: SvelteRender[];
  childSnippet: any;
  snippet?: any;
  props?: any;
  nodeKey?: string;
  type?: string;
  key?: string;
  target: HTMLElement;
  ref: MutableRefObject<HTMLElement>;
}>;
