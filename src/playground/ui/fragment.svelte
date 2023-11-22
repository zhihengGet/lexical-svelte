<script>
  let { children,...props } = $props();
</script>

<div bind:this={props.ref} {...props}>
    {@render children()}
</div>
