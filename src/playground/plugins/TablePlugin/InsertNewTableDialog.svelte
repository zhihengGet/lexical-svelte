<script context="module" lang="ts">
  import type { LexicalEditor } from "lexical";
  import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from "react";
  import Button from "../../ui/Button.svelte";
  import DialogActions from "../../ui/DialogActions.svelte";
  import TextInput from "@ui/TextInput.svelte";
  import { INSERT_TABLE_COMMAND } from "@lexical/table";
  import { INSERT_NEW_TABLE_COMMAND } from "./TableContext.svelte";
</script>

<script lang="ts">
  let { activeEditor, onClose } = $props<{
    activeEditor: LexicalEditor;
    onClose: () => void;
  }>();
  const [rows, setRows] = useState("");
  const [columns, setColumns] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const row = Number(rows);
    const column = Number(columns);
    if (row && row > 0 && row <= 500 && column && column > 0 && column <= 50) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [rows, columns]);

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_NEW_TABLE_COMMAND, { columns, rows });
    onClose();
  };
</script>

<TextInput
  placeholder={"# of rows (1-500)"}
  label="Rows"
  onChange={setRows}
  value={rows}
  data-test-id="table-modal-rows"
  type="number"
/>
<TextInput
  placeholder={"# of columns (1-50)"}
  label="Columns"
  onChange={setColumns}
  value={columns}
  data-test-id="table-modal-columns"
  type="number"
/>
<DialogActions data-test-id="table-model-confirm-insert">
  <Button disabled={isDisabled} {onClick}>Confirm</Button>
</DialogActions>
