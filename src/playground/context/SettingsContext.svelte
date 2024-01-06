<script context="module" lang="ts">
	let totalComponents = 0;

	import { useState } from 'react';

	import type { CreateEditorArgs } from 'lexical';
	import { setContext, type Snippet } from 'svelte';
	import { DEFAULT_SETTINGS, useSettings, type Settings } from '../appSettings';
	import { merge } from 'lodash-es';
	let context = 'setting context';
</script>

<script lang="ts">
	totalComponents += 1;

	const UserSetting = useSettings();

	const {
		children,
		initialConfigs,
		settings: s
	} = $props<{
		children: Snippet;
		initialConfigs?: CreateEditorArgs;
		settings: Settings;
	}>();

	const [settings, setSettings] = useState(merge(DEFAULT_SETTINGS, s));

	$effect(() => {
		// on prop change
		if (s) {
			console.log('lexical:updating props', s);
			setSettings((v) => {
				return merge(v, s);
			});
		}
	});
	if (!UserSetting) {
		setContext(context, settings);
	}
</script>

{#if !UserSetting && settings().dev}
	<button
		class="bg-gray"
		onclick={() => {
			settings().isAutocomplete = !settings().isAutocomplete;
		}}>update setting {settings().isAutocomplete} {settings().dev}</button
	>
{/if}

{@render children()}
