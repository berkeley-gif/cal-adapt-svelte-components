<script>
  export let message = "world";
</script>

<style lang="scss">
  $margin: 0;
  $font-size: 1.25rem;
  $color-strong: magenta;

  p {
    margin: $margin;
    font-size: $font-size;
  }

  strong {
    color: $color-strong;
  }
</style>

<p>Hello <strong>{message}</strong>!!!</p>
