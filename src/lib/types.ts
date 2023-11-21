import { MutableRefObject } from "react";
import { SvelteComponent } from "svelte";

export type LexicalSubscription<T> = {
  initialValueFn: () => T;
  subscribe: (callback: (value: T) => void) => () => void;
};

export type SvelteRender = {
  component: any;
  props: any;
  child?: SvelteComponent;
  nodeKey?: string;
  type?: string;
  key?: string;
  target: HTMLElement | Element;
  ref: MutableRefObject<SvelteComponent>;
};
