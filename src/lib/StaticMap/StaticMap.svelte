<script lang="ts">
  import * as d3 from "d3-geo";
  import { getTileUrl, getTiles } from "./utils";
  import type { Location, MapBoxStyle, Feature, Tiles } from "./types";

  /** specify the height of the map */
  export let height = 250;

  /** specify the width of the map */
  export let width = 250;

  /** specify the location data */
  export let location: Location | null = null;

  /** specify the mapbox basemap style type */
  export let style: MapBoxStyle = "streets-v11";

  /** specify the amount of padding between the overlay and map border */
  export let padding = 20;

  /** zoom level of the map for point geometries */
  // export let zoom = 8;

  /** wrap the map in an HTML button element or not */
  // export let useButton = true;

  const projection = d3.geoMercator();
  const path = d3.geoPath(projection);

  let tiles: Tiles;
  let tx: number;
  let ty: number;
  let k: number;
  let overlay: Feature;

  $: if (location) {
    createOverlay();
    setProjection();
    tiles = getTiles(width, height, projection)();
    [tx, ty] = tiles.translate;
    k = tiles.scale;
  }

  function createOverlay() {
    overlay = {
      type: "Feature",
      geometry: location.geometry,
      properties: {}
    };
  }

  function setProjection() {
    d3.geoPath(
      projection.fitExtent(
        [
          [padding, padding],
          [width - padding, height - padding]
        ],
        overlay
      )
    );
  }
</script>

<style lang="scss">
  div {
    display: inline-block;
    border: 1px solid #333;
  }
</style>

<div>
  <svg viewBox="0 0 {width} {height}" {...{ width, height }}>
    {#if tiles && tiles.length}
      {#each tiles as [x, y, z]}
        <image
          xlink:href="{getTileUrl(x, y, z, style)}"
          x="{Math.round((x + tx) * k)}"
          y="{Math.round((y + ty) * k)}"
          width="{k}"
          height="{k}"></image>
      {/each}
    {/if}
    {#if overlay}
      <path fill="none" stroke="teal" stroke-width="3" d="{path(overlay)}"
      ></path>
    {/if}
  </svg>
</div>
