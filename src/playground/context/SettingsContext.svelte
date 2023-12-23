<script context="module" lang="ts">
	let totalComponents = 0;

	import { useState } from 'react';

	import type { CreateEditorArgs } from 'lexical';
	import { setContext, type Snippet } from 'svelte';
	import { DEFAULT_SETTINGS, useSettings, type Settings } from '../appSettings';
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

	const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS, ...s });
	if (!UserSetting) {
		setContext(context, settings);
	}

	/*	const setOption = useCallback((setting: SettingName, value: boolean) => {
		setSettings((options) => ({
			...options,
			[setting as string]: value
		}));
		if (DEFAULT_SETTINGS[setting] === value) {
			setURLParam(setting, null);
		} else {
			setURLParam(setting, value);
		}
	}, []);
	const contextValue = useMemo(() => {
		setContext(context, { setOption, settings });
		return { setOption, settings };
	}, [setOption, settings]);

	function setURLParam(param: SettingName, value: null | boolean) {
		const url = new URL(window.location.href);
		const params = new URLSearchParams(url.search);
		if (value !== null) {
			if (params.has(param)) {
				params.set(param, String(value));
			} else {
				params.append(param, String(value));
			}
		} else {
			if (params.has(param)) {
				params.delete(param);
			}
		}
		url.search = params.toString();
		window.history.pushState(null, '', url.toString());
	}  */
</script>

<!-- {settings().dev}
{typeof UserSetting}
{#if UserSetting && UserSetting().dev}
	<button
		onclick={() => {
			UserSetting().isAutocomplete = !UserSetting().isAutocomplete;
		}}>update setting {settings().isAutocomplete} {settings().dev}</button
	>
{/if}
{#if !UserSetting && settings().dev}
	<button
		class="bg-gray"
		onclick={() => {
			settings().isAutocomplete = !settings().isAutocomplete;
		}}>update setting {settings().isAutocomplete} {settings().dev}</button
	>
{/if} -->

{@render children()}
