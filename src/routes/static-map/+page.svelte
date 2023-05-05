<script>
  import throttle from "lodash.throttle";
  import { StaticMap } from "$lib";

  /** @type {import('./$types').PageData} */
  export let data;

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

  /** @type {import('$lib/types').Location} */
  let selectedLocation;

  let useButton = true;
  let width = 320;
  let height = 250;

  /** @type {import('$lib/types').MapBoxStyle} */
  let mapStyle = "streets-v11";

  let zoom = 20;

  /**
   * @typedef {Object} location
   * @property {String} title - UNIX timestamp.
   * @property {Location} value - Booking URL.
   */
  /**
   * @type {Array<location>} locations
   */
  let locations;

  $: locations = data?.locations || [];

  $: strokeColor = darkStyles.has(mapStyle)
    ? "var(--gray-10)"
    : "var(--gray-80)";

  $: markerStrokeColor = darkStyles.has(mapStyle)
    ? "var(--gray-10)"
    : "var(--gray-90)";

  /**
   * Extend the Event class by the new target property
   * https://stackoverflow.com/questions/66206501/jsdoc-property-value-does-not-exist-on-type-eventtarget
   * @param {Event & { target: HTMLInputElement }} event
   */
  function handleClick(event) {
    window.alert(`You clicked on ${selectedLocation.title}`);
  }

  /** @param {Event & { target: HTMLInputElement }} event */
  function handleChangeWidth(event) {
    if (event.target) {
      width = +event.target.value;
    }
  }

  /** @param {Event & { target: HTMLInputElement }} event */
  function handleChangeHeight(event) {
    if (event.target) {
      height = +event.target.value;
    }
  }

  /** @param {Event & { target: HTMLInputElement }} event */
  function handleChangeZoom(event) {
    if (event.target) {
      zoom = +event.target.value;
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
  <label for="zoom">Zoom level (marker only):</label>
  <input
    on:input="{throttle(handleChangeZoom, throttleMs)}"
    value="{zoom}"
    id="zoom"
    type="number"
  />
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
  zoom="{zoom}"
  --stroke="{strokeColor}"
  --stroke-width="{4}"
  --marker-stroke="{markerStrokeColor}"
  --marker-stroke-width="{1}"
  --marker-fill="{'orange'}"
/>
