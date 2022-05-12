<script lang="ts">
  import { StaticMap } from "$lib";
  import type { Location } from "$lib/StaticMap/types";

  interface SampleLocation {
    value: Location;
    title: string;
  }

  export let locations: SampleLocation[] = [];

  let selectedLocation: Location;
  let useButton = true;
  let width = 320;
  let height = 250;

  function handleClick(event: Event) {
    if (useButton) {
      window.alert(`You clicked on ${selectedLocation.title}`);
    }
  }
</script>

<style>
  fieldset {
    margin-bottom: 1rem;
  }
</style>

<h1>Static Map</h1>
<p>
  The Static Map is intended to be used within a tool's settings panel as a
  locator map for a location selected by the user.
</p>

<fieldset>
  <label for="location">Select location:</label>
  <select bind:value="{selectedLocation}" id="location">
    {#each locations as { value, title }}
      <option value="{value}">{title}</option>
    {/each}
  </select>
</fieldset>

<fieldset>
  <label for="use-button">Make it a button?</label>
  <input bind:checked="{useButton}" type="checkbox" />
</fieldset>

<fieldset>
  <label for="width">Width: </label>
  <input bind:value="{width}" id="width" type="number" />
</fieldset>

<fieldset>
  <label for="height">Height: </label>
  <input bind:value="{height}" id="height" type="number" />
</fieldset>

<StaticMap
  on:click="{handleClick}"
  width="{width}"
  height="{height}"
  useButton="{useButton}"
  location="{selectedLocation}"
  --stroke="var(--gray-80)"
/>
