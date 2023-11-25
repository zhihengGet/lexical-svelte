import { useCallback, useMemoed, useState } from 'react';

import { default as Modal } from '../ui/Modal.svelte';
import type { SvelteRender } from '@lexical/react/types';
import type { ComponentType, SvelteComponent } from 'svelte';

export default function useModal() {
	const [modalContent, setModalContent] = useState<SvelteRender<Modal> | null>(null);

	const onClose = useCallback(() => {
		setModalContent(null);
	}, []);

	const showModal = useCallback(
		(
			action: string = 'modal',
			// eslint-disable-next-line no-shadow
			fn: (onClose: () => void) => SvelteRender<any>[]
		) => {
			{
				setModalContent({
					component: Modal,
					childComponents: fn(onClose),
					props: { title: action, onClose },
					target: null,
					portal: false
				});
			}
		},
		[onClose]
	);

	return [modalContent, showModal] as const;
}
