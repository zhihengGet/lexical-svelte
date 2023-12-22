import { useCallback, useState } from 'react';

import type { SvelteRender } from '@lexical/react/types';
import { default as Modal } from '../ui/Modal.svelte';
import { type SvelteComponent } from 'svelte';

export default function useModal() {
	let modalContent = $state<SvelteRender<Modal> | null>(); // use this if <Portal/>
	let modalChild = $state<SvelteRender>();
	let open = $state(true);

	function setModalContent(data: null | SvelteRender<Modal>) {
		modalContent = data;
	}
	const onClose = useCallback(() => {
		console.log('on close call');
		open = false;
		setModalContent(null);
	}, []);

	const showModal = (
		action: string = 'modal',
		// eslint-disable-next-line no-shadow
		fn: (onClose: () => void) => SvelteRender<SvelteComponent>[]
	) => {
		open = true;
		setModalContent({
			component: Modal,
			childComponents: fn(onClose),
			props: { title: action, onClose, open },
			target: null,
			portal: false
		});
	};
	const setModalChild = (fn: (onClose: () => void) => SvelteRender<SvelteComponent>) => {
		modalChild = fn(onClose);
	};

	$effect(() => console.log('updating useModal', modalContent));

	return [() => modalContent, showModal, () => modalChild, setModalChild] as const;
}
//TODO opt out of deep proxy
