<script context="module" lang="ts">
	let totalComponents = 0;

	import { useState } from 'react';

	import type { CreateEditorArgs } from 'lexical';
	import { setContext, type Snippet } from 'svelte';
	import { DEFAULT_SETTINGS, useSettings } from '../appSettings';
	let context = 'setting context';
</script>

<script lang="ts">
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
