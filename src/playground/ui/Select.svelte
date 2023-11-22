<script>
  let {children,label,className,...other} = $props<any>();
</script>

<div class="Input__wrapper">
  <label class="Input__label">{label}</label>
  <select {...other} class={className || "select"}>
    {@render children()}
  </select>
</div>
