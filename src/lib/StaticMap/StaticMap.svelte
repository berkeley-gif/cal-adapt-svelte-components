<script lang="ts">
  import * as d3 from "d3-geo";
  import Button from "./Button.svelte";
  import Div from "./Div.svelte";
  import { getTileUrl, getTiles } from "./utils";
  import type { Location, MapBoxStyle, Feature, Tiles } from "./types";

  /** specify the height of the map */
  export let height = 250;

  /** specify the width of the map */
  export let width = 250;

  /** specify the location data */
  export let location: Location | null = null;

  /** specify the mapbox basemap style type */
  export let basemapStyle: MapBoxStyle = "streets-v11";

  /** specify the amount of padding between the overlay and map border */
  export let padding = 20;

  /** wrap the map in an HTML button element or not */
  export let useButton = true;

  /** the id attribute of the svg title element */
  export let titleId = `cac-${Math.random().toString(36)}`;

  const projection = d3.geoMercator();
  const path = d3.geoPath(projection);

  let tiles: Tiles;
  let overlay: Feature;

  $: Wrapper = useButton ? Button : Div;
  $: ariaLabel = useButton ? "Change location" : undefined;
  $: titleText =
    location && location.title ? `Locator map for ${location.title}` : "";

  $: {
    if (location) {
      createOverlay();
      setProjection();
      tiles = getTiles(width, height, projection)();
    }
  }

  function createOverlay() {
    overlay = {
      type: "Feature",
      geometry: location.geometry,
      properties: {}
    };
  }

  function setProjection() {
    projection.fitExtent(
      [
        [padding, padding],
        [width - padding, height - padding]
      ],
      overlay
    );
  }
</script>

<style>
  div {
    display: inline-block;
    box-sizing: content-box;
    border: 1px solid var(--border-color, var(--gray-90));
    width: var(--width, 250px);
    height: var(--height, 250px);
  }

  path {
    stroke: var(--stroke, var(--gray-90));
    stroke-width: var(--stroke-width, 3);
  }
</style>

<div
  style="--width:{width}px; --height:{height}px"
  data-testid="cac-static-map-container"
>
  <svelte:component this="{Wrapper}" on:click aria-label="{ariaLabel}">
    <svg
      viewBox="0 0 {width} {height}"
      overflow="hidden"
      aria-labelledby="{titleId}"
      role="img"
    >
      <title id="{titleId}">{titleText}</title>

      <!-- FIXME: map tile gaps are visible at certain width & height settings -->
      <!-- see: https://observablehq.com/@d3/seamless-zoomable-map-tiles -->
      {#if tiles && tiles.length}
        {#each tiles as [x, y, z]}
          {@const [tx, ty] = tiles.translate}
          {@const k = tiles.scale}
          <image
            xlink:href="{getTileUrl(x, y, z, basemapStyle)}"
            x="{Math.round((x + tx) * k)}"
            y="{Math.round((y + ty) * k)}"
            width="{k}"
            height="{k}"></image>
        {/each}
      {/if}

      {#if overlay}
        <path fill="none" d="{path(overlay)}"></path>
      {/if}
    </svg>
  </svelte:component>
</div>
