<script>
  import { createEventDispatcher, afterUpdate } from "svelte";
  import Search16 from "carbon-icons-svelte/lib/Search.svelte";
  import Close16 from "carbon-icons-svelte/lib/Close.svelte";
  import ChevronUp16 from "carbon-icons-svelte/lib/ChevronUp.svelte";

  /** specify the input's label & placeholder text */
  export let description = "Search for a place name or address";

  /** specify the value of the search input */
  export let searchValue = "";

  /** specify the list of suggestions */
  /** @type {Array<import('$lib/types').Suggestion>} */
  export let suggestions = [];

  /** specify the label for the listbox */
  export let listboxLabel = "Options";

  /** specify the outline color to use when the input is focused */
  export let outlineColor = "#fdd13a";

  /** a reference to the search input */
  /** @type {HTMLInputElement | null} */
  export let inputRef = null;

  /** optional id for the input element */
  export let inputId = `cac-${Math.random().toString(36)}`;

  /** specify size of the carbon components search bar */
  /** @type {"sm" | "lg" | "xl"} */
  export let size = "sm";

  /** enables console.logging of reactive variables and some function calls */
  export let debug = false;

  const dispatch = createEventDispatcher();

  const labelId = `cac-label-${inputId}`;
  const listboxId = `cac-listbox-${inputId}`;

  /** @type {import('$lib/types').Suggestion | undefined} */
  let selectedItem = undefined;
  let open = false;
  let highlightedIndex = -1;
  /** @type {HTMLDivElement} */
  let announceContainer;

  // the id attribuxte of the selected listbox option
  $: selectedId =
    suggestions && suggestions[highlightedIndex]
      ? getOptionId(suggestions[highlightedIndex].id)
      : undefined;

  $: if (debug) {
    console.log("selectedItem: ", selectedItem);
    console.log("selectedId: ", selectedId);
    console.log("open: ", open);
    console.log("highlightedIndex: ", highlightedIndex);
    console.log("suggestions: ", suggestions);
  }

  afterUpdate(() => {
    // informs AT that the number of suggestions changed
    if (announceContainer) {
      setAriaLiveRegionContent();
    }
  });

  /** clears the value of the search input, may be used programmatically */
  export function clearSearch(focus = true) {
    if (debug) {
      console.log("--clear search--");
    }
    searchValue = "";
    highlightedIndex = -1;
    selectedItem = undefined;
    open = false;
    if (focus && inputRef) {
      inputRef.focus();
    }
    dispatch("clear");
  }

  function selectSearchResult() {
    if (debug) {
      console.log("--select search result--");
    }
    if (highlightedIndex !== -1 && suggestions[highlightedIndex]) {
      selectedItem = suggestions[highlightedIndex];
    } else {
      selectedItem = suggestions[0];
    }
    open = false;
    highlightedIndex = -1;
    searchValue = selectedItem ? selectedItem.title : "";
    dispatch("select", selectedItem);
  }

  /** @param {Event} event */
  function handleInput(event) {
    if (debug) {
      console.log("--handle input--");
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { value } = event.target;
    if (!open && value.length > 0) {
      open = true;
    }
    searchValue = value;
    if (!searchValue.length) {
      clearSearch();
    }
    if (selectedItem) {
      selectedItem = undefined;
    }
    if (highlightedIndex > -1) {
      highlightedIndex = -1;
    }
  }

  function handleInputFocus() {
    if (debug) {
      console.log("--handle focus--");
    }
    if (!open && suggestions && suggestions.length) {
      open = true;
    }
  }

  /** @param {KeyboardEvent} event */
  function handleInputKeydown(event) {
    if (debug) {
      console.log("--handle keydown--");
    }

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

      if (key === "Tab") {
        open = false;
        // we want the focus to change so don't preventDefault here
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

  /** @param {Number} dir */
  function updateHighlightedIndex(dir) {
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

  /** @param {Event} event */
  function handleWindowClick(event) {
    if (debug) {
      console.log("--handle window click--");
    }
    const { target } = event;
    if (
      open &&
      target instanceof Node &&
      inputRef &&
      !inputRef.contains(target)
    ) {
      open = false;
    }
  }

  /** @param {String | Number} value */
  function getOptionId(value) {
    return `suggestion-${value}`;
  }

  function setAriaLiveRegionContent() {
    let value;
    let selected = (suggestions && suggestions.length) || 0;
    if (selectedItem) {
      value = "";
    } else if (selected > 0 && searchValue.length) {
      value = `${selected} suggestion${selected > 1 ? "s" : ""} found.`;
    } else if (selected === 0 && searchValue.length) {
      value = "No suggestions found";
    } else {
      value = "";
    }
    if (debug) {
      console.log("--set aria live content--", value);
    }
    announceContainer.innerText = value;
  }

  /** @param {Event} event */
  function handleOptionClick(event) {
    open = !open;
    event.stopPropagation();
  }
</script>

<style lang="scss">
  @use "../../styles/themes/caladapt/mixins" as *;

  /* stylelint-disable-next-line selector-class-pattern */
  div.cac--search {
    position: relative;
    padding-left: 0.5rem;
    border: 1px solid var(--gray-60);
    background-color: var(--white);

    &:focus-within {
      @include outline-style;
      border-color: transparent;
    }

    // overrides the search icon
    /* stylelint-disable-next-line selector-class-pattern */
    :global(.bx--search-magnifier) {
      line-height: 1;
    }

    // override the close button styles
    /* stylelint-disable-next-line selector-class-pattern */
    :global(.bx--list-box__selection) {
      right: 1.75rem;
    }

    // override the chevron menu icon styles
    /* stylelint-disable-next-line selector-class-pattern */
    :global(.bx--list-box__menu-icon) {
      right: 0.5rem;
    }

    // overrides the listbox's highlighted option style
    /* stylelint-disable-next-line selector-class-pattern */
    :global(.bx--list-box__menu-item--highlighted) {
      @include outline-style;
      outline-offset: -3px;
    }

    // override the input styles
    /* stylelint-disable-next-line selector-class-pattern */
    :global(.bx--search-input) {
      padding-right: 4rem;
      padding-left: 0.5rem;
      border: none;
      color: var(--gray-90);

      &:focus {
        // outline created on parent element when focused
        outline: none;
      }

      &::placeholder {
        // ensures sufficient color contrast with placeholder text
        color: var(--gray-60);
      }
    }
  }
</style>

<!--
  Note: the following markup roughly follows the carbon-components-svelte
  package's markup for the Search, ComboBox, and ListBox components. This markup
  and CSS have been slightly modified to convey that this component is an
  autosuggest Search component, not a ComboBox or regular Search component.
  Some ARIA attributes differ as well, to follow the recommendations from the
  following examples:

  WAI-ARIA ComboBox Autocomplete List:
  https://www.w3.org/TR/wai-aria-practices-1.2/examples/combobox/combobox-autocomplete-list.html
  https://codepen.io/clhenrick/pen/PoEjyLv

  Accessible Auto Suggest:
  https://uxmastery.com/anatomy-of-an-accessible-auto-suggest/
  https://codepen.io/ademcifcioglu/pen/xdOyXv
-->
<svelte:window on:click="{handleWindowClick}" />

<div
  bind:this="{announceContainer}"
  class="sr-only"
  aria-live="assertive"
  data-testid="cac--announce-container"
></div>

<div
  class="cac--search"
  style="--outline-color:{outlineColor};"
  data-testid="cac--search-container"
>
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
      aria-activedescendant="{selectedId}"
      aria-expanded="{open}"
      aria-controls="{listboxId}"
      on:change
      on:input
      on:input="{handleInput}"
      on:focus
      on:focus="{handleInputFocus}"
      on:blur
      on:keydown
      on:keydown="{handleInputKeydown}"
      on:keyup
    />
    {#if searchValue}
      <button
        class:bx--list-box__selection="{true}"
        type="button"
        aria-label="Clear input"
        on:click="{() => clearSearch()}"
      >
        <Close16 aria-hidden="{true}" focusable="{'false'}" />
      </button>
    {/if}
    {#if suggestions && suggestions.length}
      <div
        class:bx--list-box__menu-icon="{true}"
        class:bx--list-box__menu-icon--open="{open}"
        role="button"
        aria-label="Options"
        aria-controls="{listboxId}"
        aria-expanded="{open}"
        tabindex="-1"
        on:click|preventDefault="{handleOptionClick}"
        on:keydown|preventDefault="{handleOptionClick}"
      >
        <ChevronUp16 aria-hidden="{true}" focusable="{'false'}" />
      </div>
    {/if}
  </div>
  <div
    class:bx--list-box__menu="{true}"
    id="{listboxId}"
    tabindex="-1"
    role="listbox"
    aria-label="{listboxLabel}"
    style="display:{open ? 'block' : 'none'}"
  >
    {#each suggestions as item, i (item.id)}
      <div
        id="{getOptionId(item.id)}"
        class:bx--list-box__menu-item="{true}"
        class:bx--list-box__menu-item--highlighted="{i === highlightedIndex}"
        role="option"
        tabindex="-1"
        aria-selected="{i === highlightedIndex}"
        aria-label="{item.title}"
        on:mouseenter="{() => {
          highlightedIndex = i;
        }}"
        on:click="{() => selectSearchResult()}"
        on:keydown="{() => selectSearchResult()}"
      >
        <div class:bx--list-box__menu-item__option="{true}">
          {item.title}
        </div>
      </div>
    {/each}
  </div>
</div>
