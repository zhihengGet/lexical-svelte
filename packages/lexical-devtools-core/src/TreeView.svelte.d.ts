import type { EditorSetOptions, EditorState } from 'lexical';
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports;
    z_$$bindings?: Bindings;
}
declare const TreeView: $$__sveltets_2_IsomorphicComponent<{
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
    ref: {
        current: HTMLElement;
    };
}, {
    [evt: string]: CustomEvent<any>;
}, {}, Record<string, any>, "">;
type TreeView = InstanceType<typeof TreeView>;
export default TreeView;
