<script lang="ts" context="module">
  /** @type {import('./[slug]').Load} */
  export async function load({ fetch }) {
    let locations = [];

    const fileNames = [
      "alameda",
      "california",
      "census-tract",
      "default-location",
      "los-angeles",
      "station"
    ];
    const baseUrl = "/data/locations/";

    try {
      const responses = await Promise.all(
        fileNames.map(async (file) => await fetch(`${baseUrl}${file}.json`))
      );

      const jsons = await Promise.all(
        responses.map(async (res) => await res.json())
      );

      locations = jsons.map((d) => ({
        title: d.title,
        value: d
      }));
    } catch {
      console.error("failed to fetch locations json");
    }

    if (locations && locations.length) {
      return {
        status: 200,
        props: {
          locations
        }
      };
    }

    return {
      status: 404
    };
  }
</script>

<script lang="ts">
  import throttle from "lodash.throttle";
  import { StaticMap } from "$lib";
  import type { Location } from "$lib/StaticMap/types";

  interface SampleLocation {
    value: Location;
    title: string;
  }

  export let locations: SampleLocation[] = [];

  const mapStyleOptions = [
    { title: "Streets", value: "streets-v11" },
    { title: "Light", value: "light-v10" },
    { title: "Dark", value: "dark-v10" },
    { title: "Satellite", value: "satellite-v9" },
    { title: "Satellite with Streets", value: "satellite-streets-v11" }
  ];

  const darkStyles = new Set([
    "dark-v10",
    "satellite-v9",
    "satellite-streets-v11"
  ]);

  const throttleMs = 350;

  let selectedLocation: Location;
  let useButton = true;
  let width = 320;
  let height = 250;
  let mapStyle;

  $: strokeColor = darkStyles.has(mapStyle)
    ? "var(--gray-10)"
    : "var(--gray-80)";

  function handleClick(event: Event) {
    window.alert(`You clicked on ${selectedLocation.title}`);
  }

  function handleChangeWidth(event: Event) {
    if (event.target) {
      width = +(event.target as HTMLInputElement).value;
    }
  }

  function handleChangeHeight(event: Event) {
    if (event.target) {
      height = +(event.target as HTMLInputElement).value;
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
  <label for="width">Width: </label>
  <input
    on:input="{throttle(handleChangeWidth, throttleMs)}"
    value="{width}"
    id="width"
    type="number"
  />
</fieldset>

<fieldset>
  <label for="height">Height: </label>
  <input
    on:input="{throttle(handleChangeHeight, throttleMs)}"
    value="{height}"
    id="height"
    type="number"
  />
</fieldset>

<fieldset>
  <label for="map-style">Map style: </label>
  <select bind:value="{mapStyle}" id="map-style">
    {#each mapStyleOptions as { title, value }}
      <option value="{value}">{title}</option>
    {/each}
  </select>
</fieldset>

<fieldset>
  <label for="use-button">Make it a button?</label>
  <input bind:checked="{useButton}" type="checkbox" />
</fieldset>

<StaticMap
  on:click="{handleClick}"
  width="{width}"
  height="{height}"
  useButton="{useButton}"
  location="{selectedLocation}"
  basemapStyle="{mapStyle}"
  --stroke="{strokeColor}"
/>
