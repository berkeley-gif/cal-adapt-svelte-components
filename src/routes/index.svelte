<script>
  import { TestComponent } from "$lib";
</script>

<style lang="scss">
  $font-color: #222;

  :global(body) {
    font-family: sans-serif;
    color: $font-color;
  }
</style>

<h1>Welcome to Cal-Adapt Svelte Components</h1>

<h2>Test Component</h2>

<TestComponent message="Cal-Adapt" />
