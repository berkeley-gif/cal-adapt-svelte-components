<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button, Search } from "carbon-components-svelte";

  export const description = "Search for a place name or address";
  export const inputDebounceMs = 350;

  const dispatch = createEventDispatcher();

  let searchValue = "";
  let suggestions = [];

  function selectSearchResult(item) {
    searchValue = item.title;
    suggestions = [];
    dispatch("change", item);
  }

  async function handleSearchInput(event) {
    const { value } = event.target;
    if (value && value.length >= 3) {
      await handleSearch();
    }
  }

  async function handleSearch() {
    suggestions = await getSuggestions(searchValue);
  }

  async function getSuggestions(value: string) {
    try {
      // TO DO: do geocoding / search work here
    } catch (error) {
      console.warn(error);
    }
    return [];
  }

  function handleInputKeydown(event) {
    const {
      key,
      target: { value }
    } = event;
    let flag = false;

    if (key === "Escape" || key === "Esc") {
      clearSearch();
      flag = true;
    }

    if (key === "Enter" && value && suggestions.length) {
      selectSearchResult(suggestions[0]);
      flag = true;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function clearSearch() {
    searchValue = "";
    suggestions = [];
  }
</script>

<style lang="scss">
  @use "../../styles/variables" as *;

  div {
    width: 24rem;
    padding-left: 0.5rem;
    background-color: $white;

    &:focus-within {
      outline: 2px solid $support-03;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    :global(.bx--search-input) {
      border-bottom: none;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    :global(.bx--search-input:focus) {
      // outline created on parent element on focus
      outline: none;
    }
  }

  ul,
  li {
    list-style: none;
  }

  ul {
    padding-left: 0.9rem !important;
  }
</style>

<div>
  <Search
    bind:value="{searchValue}"
    on:input="{handleSearchInput}"
    on:keydown="{handleInputKeydown}"
    on:clear="{clearSearch}"
    size="sm"
    labelText="{description}"
    placeholder="{description}"
  />
  {#if suggestions.length}
    <ul>
      {#each suggestions as item (item.id)}
        <li>
          <Button
            on:click="{() => selectSearchResult(item)}"
            size="small"
            kind="ghost">{item.title}</Button
          >
        </li>
      {/each}
    </ul>
  {/if}
</div>
