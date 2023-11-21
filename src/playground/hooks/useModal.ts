/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from "react";

import { SvelteComponent, mount } from "svelte";
import Modal from "../ui/Modal.svelte";
import { SvelteRender } from "@lexical/react/types";

export default function useModal(): [
  SvelteRender | null,
  (title: string, showModal: (onClose: () => void) => SvelteComponent) => void
] {
  const [modalContent, setModalContent] = useState<null | {
    closeOnClickOutside: boolean;
    content: SvelteComponent;
    title: string;
  }>(null);

  const onClose = useCallback(() => {
    setModalContent(null);
  }, []);

  const modal = useMemo(() => {
    if (modalContent() === null) {
      return null;
    }
    const { title, content, closeOnClickOutside } = modalContent() ?? {};

    const modal: SvelteRender = {
      component: Modal,
      props: {
        onClose,
        title: title,
        closeOnClickOutside: true,
      },
    };
    return modal;
  }, [modalContent, onClose]);

  const showModal = useCallback(
    (
      title: string,
      // eslint-disable-next-line no-shadow
      getContent: (onClose: () => void) => SvelteComponent,
      closeOnClickOutside = false
    ) => {
      setModalContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
      });
    },
    [onClose]
  );

  return [modal, showModal];
}
