<script lang="ts">
  import "./Button.css";

  import joinClasses from "../utils/joinClasses";

  let {
    "data-test-id": dataTestId,
    className,
    onClick,
    disabled,
    small,
    title,
    ...props
  } = $props<{
    "data-test-id"?: string;

    className?: string;
    disabled?: boolean;
    onClick: () => void;
    small?: boolean;
    title?: string;
  }>();
</script>

<button
  {disabled}
  class={joinClasses(
    "Button__root",
    disabled && "Button__disabled",
    small && "Button__small",
    className
  )}
  onclick={onClick}
  {title}
  aria-label={title}
  {...dataTestId && { "data-test-id": dataTestId }}
>
  <slot />
</button>
