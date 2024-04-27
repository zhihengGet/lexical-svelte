<script lang="ts">
	import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.svelte';
	import { useCallback, useState } from '../react.svelte';
	import { useSettings } from '../playground/appSettings';

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
	} = $props();
	const setting = useSettings();
	const {} = $derived(setting());
	const [editor] = useLexicalComposerContext();
	const [isEditable, setEditable] = useState(false);

	const ref = useCallback(
		(rootElement: null | HTMLElement) => {
			editor.setRootElement(rootElement);
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
	id="editor_center"
	autocorrect="false"
	aria-autocomplete="none"
	use:ref
	{role}
	{spellCheck}
	{tabIndex}
	{style}
	{...setting().contentEditableAttrs ?? {}}
/>
