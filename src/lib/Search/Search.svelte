<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Search16 from "carbon-icons-svelte/lib/Search16";
  import Close16 from "carbon-icons-svelte/lib/Close16";
  import ChevronUp16 from "carbon-icons-svelte/lib/ChevronUp16";

  // describes the properties of a suggestion item
  interface Item {
    title: string;
    id: string | number;
    value: string | number;
  }

  /** specify the input's label & placeholder text */
  export let description = "Search for a place name or address";

  /** specify the value of the search input */
  export let searchValue = "";

  /** specify the list of suggestions */
  export let suggestions: Item[] = [];

  /** specify the outline color to use when the input is focused */
  export let outlineColor = "#fdd13a";

  /** a reference to the search input */
  export let inputRef: HTMLInputElement | null = null;

  /** optional id for the input element */
  export let inputId = `cac-${Math.random().toString(36)}`;

  /** specify size of the carbon components search bar */
  export let size: "sm" | "lg" | "xl" = "sm";

  const dispatch = createEventDispatcher();

  const labelId = `cac-${inputId}`;
  const listboxId = `cac-${inputId}`;

  let selectedItem: Item;
  let open = false;
  let highlightedIndex = -1;

  $: {
    console.log("selectedItem: ", selectedItem);
    console.log("open: ", open);
    console.log("highlightedIndex: ", highlightedIndex);
  }

  /** clears the value of the search input, may be used programmatically */
  export function clearSearch(focus = true) {
    searchValue = "";
    highlightedIndex = -1;
    selectedItem = undefined;
    open = false;
    if (focus && inputRef) {
      inputRef.focus();
    }
  }

  function selectSearchResult() {
    if (highlightedIndex !== -1 && suggestions[highlightedIndex]) {
      selectedItem = suggestions[highlightedIndex];
    } else {
      selectedItem = suggestions[0];
    }
    open = false;
    highlightedIndex = -1;
    searchValue = selectedItem.title;
    dispatch("change", selectedItem);
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
      open = false;
      flag = true;
    }

    if (open && suggestions.length && !selectedItem) {
      if (key === "Enter") {
        selectSearchResult();
        flag = true;
      }

      if (key === "Home") {
        highlightFirstItem();
        flag = true;
      }

      if (key === "End") {
        highlightLastItem();
        flag = true;
      }

      if (key === "ArrowDown") {
        updateHighlightedIndex(1);
        flag = true;
      }

      if (key === "ArrowUp") {
        updateHighlightedIndex(-1);
        flag = true;
      }
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

  function handleWindowClick(event: Event) {
    const { target } = event;
    if (open && inputRef && !inputRef.contains(target as Node)) {
      open = false;
    }
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

<svelte:window on:click="{handleWindowClick}" />

<!-- TODO: add aria attribues -->
<div class="cac--search" style="--outline-color:{outlineColor};">
  <form
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
      on:input
      on:input="{handleInput}"
      on:focus
      on:blur
      on:keydown
      on:keydown="{handleInputKeydown}"
      on:keyup
    />
    {#if searchValue}
      <button
        class:bx--list-box__selection="{true}"
        type="button"
        aria-label="Clear search text"
        on:click="{() => clearSearch()}"
      >
        <Close16 />
      </button>
    {/if}
    <div
      class:bx--list-box__menu-icon="{true}"
      class:bx--list-box__menu-icon--open="{open}"
      aria-hidden="true"
      tabindex="-1"
      on:click|preventDefault="{(event) => {
        open = !open;
        event.stopPropagation();
      }}"
    >
      <ChevronUp16 />
    </div>
  </form>
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
          on:click="{() => selectSearchResult()}"
        >
          <div class:bx--list-box__menu-item__option="{true}">
            {item.title}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
