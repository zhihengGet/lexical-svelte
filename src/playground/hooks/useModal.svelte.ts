import { useCallback, useState } from 'react';

import type { SvelteRender } from '@lexical/react/types';
import { default as Modal } from '../ui/Modal.svelte';
import { type SvelteComponent, flushSync } from 'svelte';

export default function useModal() {
	let modalContent = $state<SvelteRender<Modal> | null>();

	function setModalContent(data: null | SvelteRender<Modal>) {
		modalContent = data;
	}
	const onClose = useCallback(() => {
		console.log('on close call');
		setModalContent(null);
	}, []);

	const showModal = useCallback(
		(
			action: string = 'modal',
			// eslint-disable-next-line no-shadow
			fn: (onClose: () => void) => SvelteRender<SvelteComponent>[]
		) => {
			setModalContent({
				component: Modal,
				childComponents: fn(onClose),
				props: { title: action, onClose },
				target: null,
				portal: false
			});
		},
		[onClose]
	);

	$effect(() => console.log('updating useModal', modalContent));

	return [modalContent, showModal] as const;
}
//TODO opt out of deep proxy
