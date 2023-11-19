import { SvelteComponent, mount, tick } from "svelte";

export type pluginTypes = any;

type setState<T> = T | ((props: T) => T);
export function useState<T>(state: T) {
  if (typeof state == "function") {
    state = state();
  }

  let s = $state<T>(state);

  return [
    () => s,
    (newValue: setState<T>) => {
      if (typeof newValue === "function") {
        //@ts-expect-error
        return newValue(s);
      }
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
  return $derived(fn);
}

export function useMemo(fn, dep: any) {
  const r = $derived(fn());
  return r;
}
export function useRef<T>(param: T) {
  return { current: param };
}
