<script lang="ts">
  import { Search } from "$lib";

  const suggestions = [
    {
      id: "one",
      title: "Option One"
    },
    {
      id: "two",
      title: "Option Two"
    },
    {
      id: "three",
      title: "Option Three"
    }
  ];
  const outlineColor = "var(--interactive-01)";
  const description = "Search for an option";

  let searchValue = "";
  let suggestionsFiltered = suggestions.slice();

  function handleSearchInput(event: Event) {
    const { value } = <HTMLInputElement>event.target;
    if (value && value.length) {
      suggestionsFiltered = suggestions.filter(({ title }) =>
        title.toLowerCase().includes(value.toLocaleLowerCase())
      );
    } else {
      suggestionsFiltered = suggestions.slice();
    }
  }

  function handleSearchSelection(event: CustomEvent) {
    console.log("search select event: ", event.detail);
    suggestionsFiltered = [];
  }

  function handleSearchClear() {
    alert("Search cleared!");
  }
</script>

<h1>Seach with auto-suggest</h1>
<p>
  This search input will filter suggestions as you type. To try it out, focus
  the search box and start typing the word "option".
</p>

<Search
  bind:searchValue
  on:select="{handleSearchSelection}"
  on:input="{handleSearchInput}"
  on:clear="{handleSearchClear}"
  description="{description}"
  outlineColor="{outlineColor}"
  suggestions="{suggestionsFiltered}"
  debug="{true}"
/>
