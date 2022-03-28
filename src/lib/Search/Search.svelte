<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Search } from "carbon-components-svelte";

  // describes the properties of a suggestion item
  interface Item {
    title: string;
    id: string | number;
    value: string | number;
  }

  export let description = "Search for a place name or address";
  export let searchValue = "";
  export let suggestions: Item[] = [];
  export let outlineColor = "#fdd13a"; // the color applied to the input field when focused
  export let handleSearchInput: (event: Event) => void; // specify how items are filtered when the user types
  export let clearSearch: () => void; // specify what happens when search results are cleared

  const dispatch = createEventDispatcher();

  let suggestionsList: HTMLOListElement;

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
      const items = getListItems();
      const idx = getActiveListItemIdx(items);
      selectSearchResult(suggestions[idx]);
      flag = true;
    }

    if (key === "Home" && suggestions.length) {
      highlightFirstItem();
      flag = true;
    }

    if (key === "End" && suggestions.length) {
      highlightLastItem();
      flag = true;
    }

    if (key === "ArrowDown" && suggestions.length) {
      highlightNextItem();
      flag = true;
    }

    if (key === "ArrowUp" && suggestions.length) {
      highlightPrevItem();
      flag = true;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function highlightFirstItem() {
    const items = getListItems();
    highlightItem(items[0]);
    searchValue = items[0].innerText;
  }

  function highlightLastItem() {
    const items = getListItems();
    highlightItem(items[items.length - 1]);
    searchValue = items[items.length - 1].innerText;
  }

  function highlightNextItem() {
    const items = getListItems();
    let idx = getActiveListItemIdx(items);
    let next: HTMLLIElement;

    if (idx === -1) {
      next = items[0];
    } else {
      next = items[idx + 1] || (items[0] as HTMLLIElement);
    }

    highlightItem(next);
    searchValue = next.innerText;
  }

  function highlightPrevItem() {
    const items = getListItems();
    let idx = getActiveListItemIdx(items);
    let prev: HTMLLIElement;

    if (idx === -1) {
      prev = items[items.length - 1];
    } else {
      prev = items[idx - 1] || (items[items.length - 1] as HTMLLIElement);
    }

    highlightItem(prev);
    searchValue = prev.innerText;
  }

  function highlightItem(item: HTMLLIElement) {
    const items = getListItems();
    items.forEach((item) => item.classList.remove("active"));
    item.classList.add("active");
  }

  function getListItems() {
    if (suggestionsList) {
      return Array.from(
        suggestionsList.querySelectorAll("li")
      ) as Array<HTMLLIElement>;
    }
  }

  function getActiveListItemIdx(items: HTMLLIElement[]) {
    return items.findIndex((el) => el.classList.contains("active"));
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

  ol {
    list-style: none;
    padding-left: 0.9rem !important;
  }

  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--gray-60);

    &:last-child {
      border-bottom: none;
    }

    &:global(.active) {
      background-color: var(--accent);
    }
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
    <ol bind:this="{suggestionsList}">
      {#each suggestions as item (item.id)}
        <li>
          {item.title}
        </li>
      {/each}
    </ol>
  {/if}
</div>
