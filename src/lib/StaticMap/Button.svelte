<style lang="scss">
  button {
    all: unset;
    width: var(--width, 250px);
    cursor: pointer;

    &:hover {
      box-shadow: var(--box-shadow);
    }

    &:focus {
      outline: 2px solid var(--gray-100);
    }
  }
</style>

<button on:click {...$$props}><slot /></button>
