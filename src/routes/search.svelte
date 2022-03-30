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

  function handleSearchChange(event: CustomEvent) {
    console.log("search change event: ", event.detail);
  }
</script>

<h1>Seach with auto-suggest</h1>
<p>
  This search input will filter suggestions as you type. To try it out, focus
  the search box and start typing the word "option".
</p>

<Search
  bind:searchValue
  on:change="{handleSearchChange}"
  on:input="{handleSearchInput}"
  description="{description}"
  outlineColor="{outlineColor}"
  suggestions="{suggestionsFiltered}"
/>

<br />
<p>A non-search related dummy input to test tab flow.</p>
<input type="text" />
