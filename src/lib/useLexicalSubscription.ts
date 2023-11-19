import type { LexicalEditor } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useMemo, useRef, useState } from "../react.svelte";
import useLayoutEffect from "shared/useLayoutEffect.svelte";

export type LexicalSubscription<T> = {
  initialValueFn: () => T;
  subscribe: (callback: (value: T) => void) => () => void;
};

/**
 * Shortcut to Lexical subscriptions when values are used for render.
 */
export function useLexicalSubscription<T>(
  subscription: (editor: LexicalEditor) => LexicalSubscription<T>
): T {
  const [editor] = useLexicalComposerContext();
  const initializedSubscription = useMemo(
    () => subscription(editor),
    [editor, subscription]
  );
  const valueRef = useRef<T>(initializedSubscription.initialValueFn());
  const [value, setValue] = useState<T>(valueRef.current);
  useLayoutEffect(() => {
    const { initialValueFn, subscribe } = initializedSubscription;
    const currentValue = initialValueFn();
    if (valueRef.current !== currentValue) {
      valueRef.current = currentValue;
      setValue(currentValue);
    }

    return subscribe((newValue: T) => {
      valueRef.current = newValue;
      setValue(newValue);
    });
  });

  return value();
}
