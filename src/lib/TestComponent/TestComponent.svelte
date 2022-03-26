<script lang="ts">
  export let message = "world";
  let open = true;
  const handleClick = () => (open = !open);
</script>

<style lang="scss">
  $font-size: 1.25rem;
  $color-strong: magenta;

  div {
    padding: 1rem;
    border: 1px solid #333;
    border-radius: 0.125rem;
    max-width: clamp(25%, 6rem, 100%);
  }

  p,
  summary {
    font-size: $font-size;
  }

  strong {
    color: $color-strong;
  }
</style>

<div>
  <details bind:open>
    <summary>Hello from...</summary>
    <p><strong>{message} !!!</strong></p>
    <button on:click="{handleClick}">close me</button>
  </details>
</div>
