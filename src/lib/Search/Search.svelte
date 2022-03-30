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
  const listboxId = `cac-${Math.random().toString(36)}`;

  let selectedItem: Item;
  let selectedId: string | number;
  let open = false;
  let highlightedIndex = -1;

  function selectSearchResult() {
    // what to do when item is not defined?
    if (highlightedIndex !== -1 && suggestions[highlightedIndex]) {
      selectedItem = suggestions[highlightedIndex];
      searchValue = selectedItem.title;
      suggestions = [];
      dispatch("change", selectedItem);
    }
  }

  function handleInput(event: Event) {
    const { value } = <HTMLInputElement>event.target;
    if (!open && value.length > 0) {
      open = true;
    }
    searchValue = value;
    if (!searchValue.length) {
      clearSearch();
      open = true;
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
      selectSearchResult();
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
      updateHighlightedIndex(1);
      flag = true;
    }

    if (key === "ArrowUp" && suggestions.length) {
      updateHighlightedIndex(-1);
      flag = true;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function updateHighlightedIndex(dir: number) {
    let index = highlightedIndex + dir;
    if (index < 0) {
      index = suggestions.length - 1;
    } else if (index >= suggestions.length) {
      index = 0;
    }
    highlightedIndex = index;
  }

  function highlightFirstItem() {
    highlightedIndex = 0;
  }

  function highlightLastItem() {
    highlightedIndex = suggestions.length - 1;
  }
</script>

<style lang="scss">
  /* stylelint-disable-next-line selector-class-pattern */
  div.cac--search {
    position: relative;
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
      aria-owns="{listboxId}"
      on:change
      on:input="{handleSearchInput}"
      on:input="{handleInput}"
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
      on:click="{() => {
        highlightedIndex = -1;
        searchValue = '';
      }}"
    >
      <Close16 />
    </button>
  </div>
  {#if open}
    <div class:bx--list-box__menu="{true}" id="{listboxId}" role="listbox">
      {#each suggestions as item, i (item.id)}
        <div
          class:bx--list-box__menu-item="{true}"
          class:bx--list-box__menu-item--highlighted="{i === highlightedIndex}"
          role="option"
          on:mouseenter="{() => {
            highlightedIndex = i;
          }}"
          on:click="{() => {
            selectedId = item.id;

            if (suggestions && suggestions[i]) {
              searchValue = suggestions[i].title;
            }
          }}"
        >
          <div class:bx--list-box__menu-item__option="{true}">
            {item.title}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
