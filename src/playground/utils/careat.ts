/* eslint-disable prefer-const */
/**
 * Get the caret position in all cases
 *
 * @returns {object} left, top distance in pixels
 */
export function getCaretTopPoint() {
	const sel = document.getSelection();
	const r = sel.getRangeAt(0);
	let rect;
	let r2;
	// supposed to be textNode in most cases
	// but div[contenteditable] when empty
	const node = r.startContainer;
	const offset = r.startOffset;
	if (offset > 0) {
		// new range, don't influence DOM state
		r2 = document.createRange();
		r2.setStart(node, offset - 1);
		r2.setEnd(node, offset);
		// https://developer.mozilla.org/en-US/docs/Web/API/range.getBoundingClientRect
		// IE9, Safari?(but look good in Safari 8)
		rect = r2.getBoundingClientRect();
		return { left: rect.right, top: rect.top };
	} else if (offset < node.length) {
		r2 = document.createRange();
		// similar but select next on letter
		r2.setStart(node, offset);
		r2.setEnd(node, offset + 1);
		rect = r2.getBoundingClientRect();
		return { left: rect.left, top: rect.top };
	} else {
		// textNode has length
		// https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
		rect = node.getBoundingClientRect();
		const styles = getComputedStyle(node);
		const lineHeight = parseInt(styles.lineHeight);
		const fontSize = parseInt(styles.fontSize);
		// roughly half the whitespace... but not exactly
		const delta = (lineHeight - fontSize) / 2;
		return { left: rect.left, top: rect.top + delta };
	}
}
/**
 * Get the caret position, relative to the window
 * @returns {object} left, top distance in pixels
 */
export function getCaretGlobalPosition() {
	const r = document.getSelection()?.getRangeAt(0);
	if (!r) return { left: 0, top: 0 };
	const node = r.startContainer;
	const offset = r.startOffset;
	const pageOffset = { x: window.scrollX, y: window.scrollY };
	let rect, r2;
	r2 = document.createRange();
	//if (offset >= 1e5) return { left: 0, top: 0 };
	r2.setStart(node, offset - 1);
	r2.setEnd(node, offset);
	rect = r2.getBoundingClientRect();
	return { left: rect.right + pageOffset.x, top: rect.bottom + pageOffset.y };
}
