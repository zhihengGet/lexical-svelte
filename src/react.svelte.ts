import { setContext } from 'svelte';

export interface RefObject<T> {
	readonly current: T | null;
}
export type pluginTypes = any;
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
export type HTMLAttributes = any;
type temp<T> = (props?: T) => T;
type setState<T> = T | temp<T>;
export function useState<T>(state: T | temp<T>) {
	let value;
	if (typeof state == 'function') {
		value = state();
	} else {
		value = state;
	}

	let s = $state<T>(value);

	return [
		() => s,
		(newValue: setState<T>) => {
			if (typeof newValue === 'function') {
				newValue(s);
				return s;
			}
			s = newValue;
			return s;
		}
	] as const;
}

function useEffect<D>(func: () => void, dep?: D) {
	$effect(func);
}
export { useEffect };

export function useCallback<T>(fn: T, dep?: any) {
	const b = $derived(fn);
	return b;
}

export function useMemo<T>(fn: () => T, dep?: any) {
	const r = $derived(fn());
	return r;
}
export function useRef<T>(param: T) {
	return { current: param };
}

export function createContext<T>(config) {
	return setContext<T>('', config);
}
