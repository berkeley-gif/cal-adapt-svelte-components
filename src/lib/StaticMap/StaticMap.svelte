<script lang="ts">
  import * as d3 from "d3-geo";
  import LocationMarker from "carbon-icons-svelte/lib/LocationFilled32/LocationFilled32.svelte";
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

  /** specify the zoom level when location has a point geometry */
  export let zoom = 20;

  /** wrap the map in an HTML button element or not */
  export let useButton = true;

  /** the id attribute of the svg title element */
  export let titleId = `cac-${Math.random().toString(36)}`;

  const projection = d3.geoMercator();

  // TODO: remove .pointRadius after adding the marker.
  const path = d3.geoPath(projection).pointRadius(5);

  let tiles: Tiles;
  let overlay: Feature;

  $: Wrapper = useButton ? Button : Div;
  $: ariaLabel = useButton ? "Change location" : undefined;
  $: titleText =
    location && location.title ? `Locator map for ${location.title}` : "";
  $: isPoint = location && location.geometry.type === "Point";

  $: if (zoom && location && "geometry" in location) {
    createOverlay();
    setProjection();
    tiles = getTiles(width, height, projection)();
  }

  function createOverlay() {
    overlay = {
      type: "Feature",
      geometry: location.geometry,
      properties: {}
    };
  }

  function setProjection() {
    if (isPoint && "coordinates" in overlay.geometry) {
      projection
        .center(overlay.geometry.coordinates as [number, number])
        .scale(Math.pow(2, zoom) / (2 * Math.PI))
        .translate([width / 2, height / 2]);
    } else {
      projection.fitExtent(
        [
          [padding, padding],
          [width - padding, height - padding]
        ],
        overlay
      );
    }
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
    fill: none;
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
        {#if isPoint}
          <g
            transform="{`translate(${Math.round(width / 2) - 16}, ${
              Math.round(height / 2) - 32
            })`}"
          >
            <LocationMarker
              style="{`fill: var(--marker-fill, var(--teal-40));
                stroke: var(--marker-stroke, var(--gray-80));
                stroke-width: var(--marker-stroke-width, 2);`}"
            />
          </g>
        {:else}
          <path d="{path(overlay)}"></path>
        {/if}
      {/if}
    </svg>
  </svelte:component>
</div>
