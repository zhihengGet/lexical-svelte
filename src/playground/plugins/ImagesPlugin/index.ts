import { type LexicalCommand, createCommand } from 'lexical';
import type { InsertImagePayload } from '.';

// @index('./**/*.svelte', f => `export {default as ${f.name}} from '${f.path}.svelte'`)
export { default as ImageComponent } from './ImageComponent.svelte';
export { default as ImagePlugin, type InsertImagePayload } from './ImagePlugin.svelte';
export { default as ImageResizer } from './ImageResizer.svelte';
export { default as InsertImageDialog } from './InsertImageDialog.svelte';
export { default as InsertImageUploadedDialogBody } from './InsertImageUploadedDialogBody.svelte';
export { default as InsertImageUriDialogBody } from './InsertImageUriDialogBody.svelte';
export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
	createCommand('INSERT_IMAGE_COMMAND');
