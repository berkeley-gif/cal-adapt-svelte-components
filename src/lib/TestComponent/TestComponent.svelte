<script>
  export let message = "world";
</script>

<style lang="scss">
  $margin: 0;
  $font-size: 1.25rem;
  $color-strong: magenta;

  div {
    padding: 1rem;
    border: 1px solid #333;
    border-radius: 0.125rem;
    max-width: clamp(25%, 6rem, 100%);
  }

  p {
    margin: $margin;
    font-size: $font-size;
  }

  strong {
    color: $color-strong;
  }
</style>

<div>
  <p>Hello <strong>{message}</strong>!!!</p>
</div>
