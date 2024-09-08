<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { useCallback, useState } from '../react.svelte';
	import { useSettings } from '../playground/appSettings';
	import type { LexicalEditor } from 'lexical';
	type Props = {
		editor: LexicalEditor;
		ariaActiveDescendant?: React.AriaAttributes['aria-activedescendant'];
		ariaAutoComplete?: React.AriaAttributes['aria-autocomplete'];
		ariaControls?: React.AriaAttributes['aria-controls'];
		ariaDescribedBy?: React.AriaAttributes['aria-describedby'];
		ariaExpanded?: React.AriaAttributes['aria-expanded'];
		ariaLabel?: React.AriaAttributes['aria-label'];
		ariaLabelledBy?: React.AriaAttributes['aria-labelledby'];
		ariaMultiline?: React.AriaAttributes['aria-multiline'];
		ariaOwns?: React.AriaAttributes['aria-owns'];
		ariaRequired?: React.AriaAttributes['aria-required'];
		autoCapitalize?: HTMLDivElement['autocapitalize'];
		'data-testid'?: string | null | undefined;
	} & Omit<React.AllHTMLAttributes<HTMLDivElement>, 'placeholder'>;
	const {
		ariaActiveDescendant,
		ariaAutoComplete,
		ariaControls,
		ariaDescribedBy,
		ariaExpanded,
		ariaLabel,
		ariaLabelledBy,
		ariaMultiline,
		ariaOwns,
		ariaRequired,
		autoCapitalize,
		id,
		role = 'textbox',
		spellCheck = true,
		style,
		tabIndex,
		'data-testid': testid,
		...rest
	}: Props = $props();
	const setting = useSettings();
	const [editor] = useLexicalComposerContext();
	const [isEditable, setEditable] = useState(false);

	const ref = useCallback(
		(rootElement: null | HTMLElement) => {
			// defaultView is required for a root element.
			// In multi-window setups, the defaultView may not exist at certain points.
			if (rootElement && rootElement.ownerDocument && rootElement.ownerDocument.defaultView) {
				editor.setRootElement(rootElement);
			} else {
				editor.setRootElement(null);
			}
			console.log('lexical:set root element');
		},
		[editor]
	);

	$effect(() => {
		setEditable(editor.isEditable());
		return editor.registerEditableListener((currentIsEditable) => {
			setEditable(currentIsEditable);
		});
	});
</script>

<div
	{...rest}
	aria-activedescendant={!isEditable() ? undefined : ariaActiveDescendant}
	aria-controls={!isEditable() ? undefined : ariaControls}
	aria-describedby={ariaDescribedBy}
	aria-expanded={!isEditable() ? undefined : role === 'combobox' ? !!ariaExpanded : undefined}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabelledBy}
	aria-multiline={ariaMultiline}
	aria-owns={!isEditable() ? undefined : ariaOwns}
	aria-readonly={!isEditable() ? true : undefined}
	aria-required={ariaRequired}
	autocapitalize={autoCapitalize}
	contentEditable={isEditable()}
	data-testid={'editor'}
	autocorrect="false"
	aria-autocomplete="none"
	use:ref
	{role}
	spellcheck={spellCheck}
	{tabIndex}
	{style}
	{...setting().contentEditableAttrs ?? {}}
></div>
