<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Search16 from "carbon-icons-svelte/lib/Search16";
  import Close16 from "carbon-icons-svelte/lib/Close16";

  // describes the properties of a suggestion item
  interface Item {
    title: string;
    id: string | number;
    value: string | number;
  }

  /** specify the label & placeholder text */
  export let description = "Search for a place name or address";

  /** the value of the search input */
  export let searchValue = "";

  /** the list of suggestions */
  export let suggestions: Item[] = [];

  /** the outline color to use when the input is focused */
  export let outlineColor = "#fdd13a";

  /** a reference to the search input */
  export let inputRef: HTMLInputElement | null = null;

  /** optional id for the input element */
  export let inputId = `cac-${Math.random().toString(36)}`;

  /** size of the search bar */
  export let size: "sm" | "lg" | "xl" = "sm";

  /** specify how items are filtered when the user types */
  export let handleSearchInput: (event: Event) => void;

  /** specify what happens when search results are cleared */
  export let clearSearch: () => void;

  const dispatch = createEventDispatcher();

  const labelId = `cac-${Math.random().toString(36)}`;

  let suggestionsList: HTMLOListElement;

  function selectSearchResult(item: Item) {
    // what to do when item is not defined?
    if (item) {
      searchValue = item.title;
      suggestions = [];
      dispatch("change", item);
    }
  }

  function handleInputKeydown(event: KeyboardEvent) {
    const key = event.key;
    let flag = false;

    if (key === "Escape" || key === "Esc") {
      clearSearch();
      flag = true;
    }

    if (key === "Enter" && suggestions.length) {
      const items = getListItems();
      const idx = getActiveListItemIdx(items);
      // what do to when idx === -1?
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
  }

  function highlightLastItem() {
    const items = getListItems();
    highlightItem(items[items.length - 1]);
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
  /* stylelint-disable-next-line selector-class-pattern */
  div.cac--search {
    padding-left: 0.5rem;
    background-color: var(--white);
    border: 1px solid var(--gray-60);

    &:focus-within {
      border-color: transparent;
      outline: 2px solid var(--outline-color, var(--support-03));
    }

    /* stylelint-disable-next-line selector-class-pattern */
    :global(.bx--search-input) {
      border: none;
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

<!-- TODO: add aria attribues -->
<div class="cac--search" style="--outline-color:{outlineColor};">
  <div
    class:bx--search="{true}"
    class:bx--search--sm="{size === 'sm'}"
    class:bx--search--lg="{size === 'lg'}"
    class:bx--search--xl="{size === 'xl'}"
    role="search"
    aria-labelledby="{labelId}"
  >
    <div class="bx--search-magnifier">
      <Search16 />
    </div>
    <label id="{labelId}" class="bx--label" for="{inputId}">{description}</label
    >
    <input
      bind:this="{inputRef}"
      bind:value="{searchValue}"
      id="{inputId}"
      class:bx--search-input="{true}"
      type="text"
      role="combobox"
      placeholder="{description}"
      autocomplete="off"
      aria-autocomplete="both"
      aria-owns="res"
      on:change
      on:input="{handleSearchInput}"
      on:focus
      on:blur
      on:keydown
      on:keydown="{handleInputKeydown}"
      on:keyup
    />
    <button
      class:bx--search-close="{true}"
      class:bx--search-close--hidden="{searchValue === ''}"
      type="button"
      aria-label="Clear search input"
      on:click="{clearSearch}"
    >
      <Close16 />
    </button>
  </div>
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
