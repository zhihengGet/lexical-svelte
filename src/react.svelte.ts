import { SvelteComponent, mount, tick } from "svelte";

export type pluginTypes = any;

export function flushSync(fn) {
  tick().then(fn);
}
export function useState<T>(state: T) {
  let s = $state<T>(state);

  return [
    () => s,
    (newValue: T) => {
      s = newValue;
    },
  ] as const;
}

export function useEffect<D>(func: () => void, dep: D) {
  $effect(func);
}
export function createPortal(
  SvelteComponent: SvelteComponent,
  element: HTMLElement,
  name: any
) {
  mount(SvelteComponent, { target: element, props: name });
}
export function useCallback<T>(fn: T, dep: any) {
  return fn;
}

export function useMemo(fn, dep: any) {
  const r = $derived(fn());
  return r;
}
export function useRef<T>(param: T) {
  return { current: param };
}
