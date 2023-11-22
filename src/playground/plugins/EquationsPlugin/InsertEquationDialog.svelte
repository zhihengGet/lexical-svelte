<script lang="ts">
  import { LexicalEditor, LexicalCommand, createCommand } from "lexical";
  import KatexEquationAlterer from "./KatexEquationAlterer.svelte";
  import { useCallback } from "react";
  import { INSERT_EQUATION_COMMAND } from "./EquationsPlugin.svelte";

  let { activeEditor, onClose } = $props<{
    activeEditor: LexicalEditor;
    onClose: () => void;
  }>();
  const onEquationConfirm = useCallback(
    (equation: string, inline: boolean) => {
      activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, {
        equation,
        inline,
      });
      onClose();
    },
    [activeEditor, onClose]
  );
</script>

<KatexEquationAlterer onConfirm={onEquationConfirm} />
