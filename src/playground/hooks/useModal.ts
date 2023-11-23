import { useCallback, useMemo, useState } from "react";

import Modal from "../ui/Modal.svelte";
import type { SvelteRender } from "@lexical/react/types";

export default function useModal() {
  const [modalContent, setModalContent] = useState<null | {
    closeOnClickOutside: boolean;
    content: SvelteRender;
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
      childSnippet: content,
      props: {
        onClose,
        title: title,
        closeOnClickOutside: closeOnClickOutside,
      },
    };
    return modal;
  }, [modalContent, onClose]);

  const showModal = useCallback(
    (
      title: string,
      // eslint-disable-next-line no-shadow
      getContent: (onClose: () => void) => SvelteRender,
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

  return [modal, showModal] as const;
}
