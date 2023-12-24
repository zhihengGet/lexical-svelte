// Modified from Grail UI v0.9.6 (2023-06-10)
// Source: https://github.com/grail-ui/grail-ui
// https://github.com/grail-ui/grail-ui/tree/master/packages/grail-ui/src/clickOutside/clickOutside.ts

import { readable } from 'svelte/store';
import { get } from 'svelte/store';
export function addEventListener(
	target: Window | Document | EventTarget,
	event: Array<string> | string,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) {
	const events = Array.isArray(event) ? event : [event];

	// Add the event listener to each specified event for the target element(s).
	events.forEach((_event) => target.addEventListener(_event, handler, options));

	// Return a function that removes the event listener from the target element(s).
	return () => {
		events.forEach((_event) => target.removeEventListener(_event, handler, options));
	};
}

/**
 * Creates a readable store that tracks the latest PointerEvent that occurred on the document.
 *
 * @returns A function to unsubscribe from the event listener and stop tracking pointer events.
 */
const documentClickStore = readable<PointerEvent | undefined>(undefined, (set): (() => void) => {
	/**
	 * Event handler for pointerdown events on the document.
	 * Updates the store's value with the latest PointerEvent and then resets it to undefined.
	 */
	function clicked(event: PointerEvent | undefined) {
		set(event);

		// New subscriptions will not trigger immediately
		set(undefined);
	}

	// Adds a pointerdown event listener to the document, calling the clicked function when triggered.
	const unsubscribe = addEventListener(document, 'pointerup', clicked, {
		passive: false,
		capture: true
	});

	// Returns a function to unsubscribe from the event listener and stop tracking pointer events.
	return unsubscribe;
});
type ClickOutsideConfig = { enabled: boolean; handler: (e: PointerEvent) => void } | {};
export const useClickOutside = (node: HTMLElement, config: ClickOutsideConfig = {}) => {
	let options = { enabled: true, ...config };

	// Returns true if the click outside handler is enabled
	function isEnabled(): boolean {
		return typeof options.enabled === 'boolean' ? options.enabled : get(options.enabled);
	}

	// Handle document clicks
	const unsubscribe = documentClickStore.subscribe((e) => {
		// If the click outside handler is disabled, or if the event is null or the node itself, return early
		if (!isEnabled() || !e || e.target === node) {
			return;
		}

		const composedPath = e.composedPath();

		// If the target is in the node, return early
		if (composedPath.includes(node)) return;

		// If none of the above conditions are met, call the handler
		options.handler?.(e);
	});

	return {
		update(params: Partial<ClickOutsideConfig>) {
			options = { ...options, ...params };
		},
		destroy() {
			unsubscribe();
		}
	};
};
