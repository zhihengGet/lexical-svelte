<script>
  import "./Dialog.css";
  let { children, ...props } = $props();
</script>

<div class="DialogActions">
  {@render children?.()}
</div>
