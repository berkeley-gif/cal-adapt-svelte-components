<script lang="ts">
  import { createEventDispatcher } from "svelte";

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
  const getRandomId = (precision = 9) =>
    Math.random().toFixed(precision).replace(".", "");
  const inputId = `combo-box-${getRandomId()}`;
  const labelId = `label-${getRandomId()}`;

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
    const value = (<HTMLInputElement>event.target).value;
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
  div.ca--search {
    padding-left: 0.5rem;
    background-color: var(--white);
    border: 1px solid var(--gray-60);

    &:focus-within {
      border: none;
      outline: 2px solid var(--support-03);
    }

    /* stylelint-disable-next-line selector-class-pattern */
    :global(.bx--search-input) {
      border-color: transparent;
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
<div class="ca--search" style="outline-color: {outlineColor}">
  <!-- <Search
    bind:value="{searchValue}"
    on:input="{handleSearchInput}"
    on:keydown="{handleInputKeydown}"
    on:clear="{clearSearch}"
    size="sm"
    labelText="{description}"
    placeholder="{description}"
  /> -->
  <div
    class="bx--search bx--search--sm"
    role="search"
    aria-labelledby="{labelId}"
  >
    <div class="bx--search-magnifier">
      <svg
        data-carbon-icon="Search16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="16"
        height="16"
        class="bx--search-magnifier-icon"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
        ><path
          d="M15,14.3L10.7,10c1.9-2.3,1.6-5.8-0.7-7.7S4.2,0.7,2.3,3S0.7,8.8,3,10.7c2,1.7,5,1.7,7,0l4.3,4.3L15,14.3z M2,6.5	C2,4,4,2,6.5,2S11,4,11,6.5S9,11,6.5,11S2,9,2,6.5z"
        ></path></svg
      >
      <!-- <Search16 /> -->
    </div>
    <label id="{labelId}" class="bx--label" for="{inputId}">{description}</label
    >
    <input
      id="{inputId}"
      class="bx--search-input"
      role="combobox"
      placeholder="{description}"
      type="text"
      aria-autocomplete="both"
      aria-owns="res"
      autocomplete="off"
    />
    <button
      class="bx--search-close bx--search-close--hidden"
      type="button"
      aria-label="Clear search input"
    >
      <svg
        data-carbon-icon="Close16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        width="16"
        height="16"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
        ><path
          d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"
        ></path></svg
      >
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
