export function objectToCssString(styleObject: object | null) {
	if (styleObject == null) return '';
	return Object.entries(styleObject)
		.map(([property, value]) => {
			// Convert camelCase to kebab-case
			const kebabProperty = property.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
			return `${kebabProperty}: ${value};`;
		})
		.join(' ');
}
