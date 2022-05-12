<script lang="ts">
  import { StaticMap } from "$lib";
  import type { Location } from "$lib/StaticMap/types";

  interface SampleLocation {
    value: Location;
    title: string;
  }

  export let locations: SampleLocation[] = [];

  let selectedLocation: Location;
</script>

<style>
  fieldset {
    margin-bottom: 2rem;
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

<StaticMap
  width="{320}"
  location="{selectedLocation}"
  --stroke="var(--gray-80)"
/>
