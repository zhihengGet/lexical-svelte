import { has } from 'lodash-es';
import { setContext, untrack } from 'svelte';

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

	const getState: () => T = function () {
		return s;
	};
	//@ts-expect-error
	getState._custom_source = 'svelte';
	return [
		getState,
		(newValue: setState<T>): T => {
			if (typeof newValue === 'function') {
				s = newValue(s);
				return s;
			}
			s = newValue;
			return s;
		}
	] as const;
}

function useEffect(func: () => void, dep?: any[]) {
	const cleanup = {
		fn: () => {
			console.log('no cleanup fn');
		}
	};
	if (dep) {
		$effect(() => {
			for (const d of dep) {
				if (has(d, '_custom_source')) {
					d();
				}
			}
			untrack(() => {
				cleanup.fn = func();
			});
			return cleanup.fn;
		});
	} else $effect(func);
}
export { useEffect };

//TODO cant just return an value, wont be reactive
export function useCallback<T>(fn: T, dep?: any) {
	const b = $derived(fn);
	return b;
}
//TODO , cant just return an value
export function useMemo<T>(fn: () => T, dep?: any) {
	const closure = () => {
		if (dep) {
			dep;
			return untrack(fn);
		}
		return fn();
	};
	const data = $derived(closure());
	return data;
}

//TODO , cant just return an value
export function useMemoed<T>(fn: () => T, dep?: any) {
	const data = $derived(fn());
	return () => data;
}
export function useRef<T>(param: T | null) {
	let state = $state<{ current: T }>({ current: param });
	return state;
}

export function createContext<T>(config) {
	return setContext<T>('', config);
}
