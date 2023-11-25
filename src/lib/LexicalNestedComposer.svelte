<script lang="ts">
	import type { LexicalComposerContextType } from '@lexical/react/LexicalComposerContext.svelte';

	// import { useCollaborationContext } from "@lexical/react/LexicalCollaborationContext";
	import {
		createLexicalComposerContext,
		setLexicalComposerContext
	} from '@lexical/react/LexicalComposerContext.svelte';
	import type {
		EditorThemeClasses,
		Klass,
		LexicalEditor,
		LexicalNode,
		LexicalNodeReplacement
	} from 'lexical';

	import { useEffect, useRef } from 'react';
	import invariant from 'shared/invariant';
	import { useLexicalComposerContext } from './LexicalComposerContext.svelte';
	import { useCollaborationContext } from './LexicalCollaborationContext.svelte';
	let {
		initialEditor,

		initialNodes,
		initialTheme,
		skipCollabChecks
	} = $props<{
		initialEditor: LexicalEditor;
		initialTheme?: EditorThemeClasses;
		initialNodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>;
		skipCollabChecks?: true;
	}>();

	const wasCollabPreviouslyReadyRef = useRef(false);
	const parentContext = useLexicalComposerContext();

	if (parentContext == null) {
		invariant(false, 'Unexpected parent context null on a nested composer');
	}

	const [parentEditor, { getTheme: getParentTheme }] = parentContext;

	const composerTheme: EditorThemeClasses | undefined =
		initialTheme || getParentTheme() || undefined;

	const context: LexicalComposerContextType = createLexicalComposerContext(
		parentContext,
		composerTheme
	);

	if (composerTheme !== undefined) {
		initialEditor._config.theme = composerTheme;
	}

	initialEditor._parentEditor = parentEditor;

	if (!initialNodes) {
		const parentNodes = (initialEditor._nodes = new Map(parentEditor._nodes));
		for (const [type, entry] of parentNodes) {
			initialEditor._nodes.set(type, {
				klass: entry.klass,
				replace: entry.replace,
				replaceWithKlass: entry.replaceWithKlass,
				transforms: new Set()
			});
		}
	} else {
		for (let klass of initialNodes) {
			let replace = null;
			let replaceWithKlass = null;

			if (typeof klass !== 'function') {
				const options = klass;
				klass = options.replace;
				replace = options.with;
				replaceWithKlass = options.withKlass || null;
			}

			initialEditor._nodes.set(klass.getType(), {
				klass,
				replace,
				replaceWithKlass,
				transforms: new Set()
			});
		}
	}

	initialEditor._config.namespace = parentEditor._config.namespace;

	initialEditor._editable = parentEditor._editable;

	const composerContext = [initialEditor, context] as [LexicalEditor, LexicalComposerContextType];

	// If collaboration is enabled, make sure we don't render the children until the collaboration subdocument is ready.
	const { isCollabActive, yjsDocMap } = useCollaborationContext();

	//nested context
	setLexicalComposerContext(composerContext);
	const isCollabReady =
		skipCollabChecks ||
		wasCollabPreviouslyReadyRef.current ||
		yjsDocMap?.has(initialEditor.getKey());

	useEffect(() => {
		if (isCollabReady) {
			wasCollabPreviouslyReadyRef.current = true;
		}
	}, [isCollabReady]);

	// Update `isEditable` state of nested editor in response to the same change on parent editor.
	useEffect(() => {
		return parentEditor.registerEditableListener((editable) => {
			initialEditor.setEditable(editable);
		});
	}, [initialEditor, parentEditor]);
</script>

{#if !isCollabActive || isCollabReady}
	<slot />
{/if}
