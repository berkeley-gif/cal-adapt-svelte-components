<script lang="ts">
  import { Search } from "$lib";

  const suggestions = [
    {
      id: "one",
      title: "Option One",
      value: 1
    },
    {
      id: "two",
      title: "Option Two",
      value: 2
    },
    {
      id: "three",
      title: "Option Three",
      value: 3
    }
  ];
  const outlineColor = "#036063";

  let searchValue = "";
  let suggestionsFiltered = [];

  function handleSearchInput(event: Event) {
    const { value } = <HTMLInputElement>event.target;

    if (value && value.length >= 3) {
      searchForItem(value);
    } else {
      suggestionsFiltered = [];
    }
  }

  function searchForItem(value: string) {
    suggestionsFiltered = suggestions.filter(({ title }) =>
      title.toLowerCase().includes(value.toLocaleLowerCase())
    );
  }

  function handleSearchChange(event: CustomEvent) {
    console.log(event.detail);
  }

  function clearSearch() {
    suggestionsFiltered = [];
    searchValue = "";
  }
</script>

<h1>Seach with auto-suggest</h1>
<p>
  This search input will filter suggestions as you type. To try it out, focus
  the search box and start typing the word "option".
</p>

<Search
  on:change="{handleSearchChange}"
  outlineColor="{outlineColor}"
  suggestions="{suggestionsFiltered}"
  searchValue="{searchValue}"
  handleSearchInput="{handleSearchInput}"
  clearSearch="{clearSearch}"
/>
