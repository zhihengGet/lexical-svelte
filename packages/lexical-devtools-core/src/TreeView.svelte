<script lang="ts">
	import type { EditorSetOptions, EditorState } from 'lexical';
	import { useCallback, useEffect, useRef, useState } from 'react';

	const LARGE_EDITOR_STATE_SIZE = 1000;
	interface props {
		editorState: EditorState;
		treeTypeButtonclass?: string;
		timeTravelButtonclass?: string;
		timeTravelPanelButtonclass?: string;
		timeTravelPanelclass?: string;
		timeTravelPanelSliderclass?: string;
		viewclass?: string;
		generateContent: (exportDOM: boolean) => Promise<string>;
		setEditorState: (state: EditorState, options?: EditorSetOptions) => void;
		setEditorReadOnly: (isReadonly: boolean) => void;
		ref: { current: HTMLElement };
	}
	let {
		treeTypeButtonclass,
		timeTravelButtonclass,
		timeTravelPanelSliderclass,
		timeTravelPanelButtonclass,
		viewclass,
		timeTravelPanelclass,
		editorState,
		setEditorState,
		setEditorReadOnly,
		generateContent,
		ref
	}: props = $props();
	const [timeStampedEditorStates, setTimeStampedEditorStates] = useState<
		Array<[number, EditorState]>
	>([]);
	const [content, setContent] = useState<string>('');
	const [timeTravelEnabled, setTimeTravelEnabled] = useState(false);
	const [showExportDOM, setShowExportDOM] = useState(false);
	const playingIndexRef = useRef(0);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLimited, setIsLimited] = useState(false);
	const [showLimited, setShowLimited] = useState(false);
	const lastEditorStateRef = useRef<null | EditorState>();
	const lastGenerationID = useRef(0);

	const generateTree = useCallback(
		(exportDOM: boolean) => {
			const myID = ++lastGenerationID.current;
			generateContent(exportDOM)
				.then((treeText) => {
					if (myID === lastGenerationID.current) {
						setContent(treeText);
					}
				})
				.catch((err) => {
					if (myID === lastGenerationID.current) {
						setContent(`Error rendering tree: ${err.message}\n\nStack:\n${err.stack}`);
					}
				});
		},
		[generateContent]
	);

	$effect(() => {
		if (!showLimited() && editorState._nodeMap.size > LARGE_EDITOR_STATE_SIZE) {
			setIsLimited(true);
			if (!showLimited()) {
				return;
			}
		}

		// Prevent re-rendering if the editor state hasn't changed
		if (lastEditorStateRef.current !== editorState) {
			lastEditorStateRef.current = editorState;
			generateTree(showExportDOM());

			if (!timeTravelEnabled()) {
				setTimeStampedEditorStates((currentEditorStates) => [
					...currentEditorStates,
					[Date.now(), editorState]
				]);
			}
		}
	});

	const totalEditorStates = timeStampedEditorStates.length;

	$effect(() => {
		if (isPlaying()) {
			let timeoutId: ReturnType<typeof setTimeout>;

			const play = () => {
				const currentIndex = playingIndexRef.current;

				if (currentIndex === totalEditorStates - 1) {
					setIsPlaying(false);
					return;
				}

				const currentTime = timeStampedEditorStates()[currentIndex][0];
				const nextTime = timeStampedEditorStates()[currentIndex + 1][0];
				const timeDiff = nextTime - currentTime;
				timeoutId = setTimeout(() => {
					playingIndexRef.current++;
					const index = playingIndexRef.current;
					const input = inputRef.current;

					if (input !== null) {
						input.value = String(index);
					}

					setEditorState(timeStampedEditorStates()[index][1]);
					play();
				}, timeDiff);
			};

			play();

			return () => {
				clearTimeout(timeoutId);
			};
		}
	});

	const handleExportModeToggleClick = () => {
		generateTree(!showExportDOM());
		setShowExportDOM(!showExportDOM());
	};
</script>

<div class={viewclass}>
	{#if !showLimited() && isLimited()}
		<div class="p-20px">
			<span class="p-20px">
				Detected large EditorState, this can impact debugging performance.
			</span>
			<button
				onclick={() => {
					setShowLimited(true);
				}}
			>
				Show full tree
			</button>
		</div>
	{/if}
	{#if !showLimited()}
		<button onclick={() => handleExportModeToggleClick()} class={treeTypeButtonclass} type="button">
			{showExportDOM() ? 'Tree' : 'Export DOM'}
		</button>
	{/if}
	{#if !timeTravelEnabled() && (showLimited() || !isLimited()) && totalEditorStates > 2}
		<button
			onclick={() => {
				setEditorReadOnly(true);
				playingIndexRef.current = totalEditorStates - 1;
				setTimeTravelEnabled(true);
			}}
			class={timeTravelButtonclass}
			type="button"
		>
			Time Travel
		</button>
	{/if}

	{#if showLimited() || !isLimited()}
		<pre bind:this={ref.current}>{content()}</pre>
	{/if}
	{#if timeTravelEnabled() && (showLimited() || !isLimited())}
		<div class={timeTravelPanelclass}>
			<button
				class={timeTravelPanelButtonclass}
				onclick={() => {
					if (playingIndexRef.current === totalEditorStates - 1) {
						playingIndexRef.current = 1;
					}
					setIsPlaying(!isPlaying);
				}}
				type="button"
			>
				{isPlaying() ? 'Pause' : 'Play'}
			</button>
			<input
				class={timeTravelPanelSliderclass}
				bind:this={inputRef.current}
				onchange={(event) => {
					const editorStateIndex = Number(event.target.value);
					const timeStampedEditorState = timeStampedEditorStates()[editorStateIndex];

					if (timeStampedEditorState) {
						playingIndexRef.current = editorStateIndex;
						setEditorState(timeStampedEditorState[1]);
					}
				}}
				type="range"
				min="1"
				max={totalEditorStates - 1}
			/>
			<button
				class={timeTravelPanelButtonclass}
				onclick={() => {
					setEditorReadOnly(false);
					const index = timeStampedEditorStates.length - 1;
					const timeStampedEditorState = timeStampedEditorStates()[index];
					setEditorState(timeStampedEditorState[1]);
					const input = inputRef.current;

					if (input !== null) {
						input.value = String(index);
					}

					setTimeTravelEnabled(false);
					setIsPlaying(false);
				}}
				type="button"
			>
				Exit
			</button>
		</div>
	{/if}
</div>

<style>
</style>
