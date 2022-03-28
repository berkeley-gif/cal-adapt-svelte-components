<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button, Search } from "carbon-components-svelte";

  // describes the properties of a suggestion item
  interface Item {
    title: string;
    id: string | number;
    value: any;
  }

  export let description = "Search for a place name or address";
  export let searchValue = "";
  export let suggestions: Item[] = [];
  export let outlineColor = "#fdd13a"; // the color applied to the input field when focused
  export let handleSearchInput: (event: Event) => void; // specify how items are filtered when the user types
  export let clearSearch: () => void; // specify what happens when search results are cleared

  const dispatch = createEventDispatcher();

  function selectSearchResult(item: Item) {
    searchValue = item.title;
    suggestions = [];
    dispatch("change", item);
  }

  function handleInputKeydown(event: KeyboardEvent) {
    const key = event.key;
    const value = (<HTMLInputElement>event.target).value;
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
</script>

<style lang="scss">
  div {
    padding-left: 0.5rem;
    background-color: var(--white);
    border: 1px solid var(--gray-60);

    &:focus-within {
      border: none;
      outline: 2px solid var(--support-03);
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

<div style="outline-color: {outlineColor}">
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
