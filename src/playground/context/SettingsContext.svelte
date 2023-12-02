<script context="module" lang="ts">
	let totalComponents = 0;
	type SettingsContextShape = {
		setOption: (name: SettingName, value: boolean) => void;
		settings: () => Record<SettingName, boolean>;
	};
	let context = 'setting context';
	export const useSettings = () => {
		return getContext(context) as () => Settings;
	};
	export const settingContext = (config: () => Settings) => {
		setContext(context, config);
	};
</script>

<script lang="ts">
	import type { SettingName, Settings } from '../appSettings';

	import { createContext, useCallback, useMemo, useState } from 'react';

	import { DEFAULT_SETTINGS } from '../appSettings';
	import { getContext, setContext, type Snippet } from 'svelte';
	import type { CreateEditorArgs } from 'lexical';

	totalComponents += 1;

	const text = useSettings();

	const { children, initialConfigs } = $props<{
		children: Snippet;
		initialConfigs?: CreateEditorArgs;
	}>();
	const [settings, setSettings] = useState(DEFAULT_SETTINGS);
	if (!text) {
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

{@render children()}
