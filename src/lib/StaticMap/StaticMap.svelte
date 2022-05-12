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
  export let padding = 50;

  /** zoom level of the map for point geometries */
  export let zoom = 8;

  /** wrap the map in an HTML button element or not */
  export let useButton = true;

  const projection = d3.geoMercator();
  const path = d3.geoPath(projection);

  let tiles: Tiles;
  let tx: number;
  let ty: number;
  let k: number;
  let overlay: Feature;
  let heightComputed: number;

  $: console.log(tiles);

  $: if (location) {
    createOverlay();
    setProjection();
    tiles = getTiles(width, heightComputed, projection)();
    tx = tiles.translate[0];
    ty = tiles.translate[1];
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
    const [[, y0], [, y1]] = d3
      .geoPath(projection.fitWidth(width, overlay))
      .bounds(overlay);
    const height = Math.ceil(y1 - y0);
    const scale = projection.scale() * (2 * Math.PI);
    projection.center(projection.invert([width / 2, height / 2]));
    projection.scale(Math.pow(2, Math.floor(Math.log2(scale))) / (2 * Math.PI));
    projection.translate([width / 2, height / 2]);
    heightComputed = height;
  }
</script>

<style lang="scss">
  pre {
    margin-bottom: 2rem;
    padding: 1rem;
    max-width: 50vw;
    overflow-x: auto;
    line-height: 1.5;
  }

  div {
    display: inline-block;
    border: 1px solid #333;
  }
</style>

<small>props:</small>
<pre>
  height: {heightComputed}
  width: {width}
  location: {JSON.stringify(location)}
  style: {style}
  padding: {padding}
  zoom: {zoom}
  useButton: {useButton}
</pre>
<div>
  {#if heightComputed}
    <svg viewBox="0 0 {width} {heightComputed}" {...{ width, heightComputed }}>
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
  {/if}
</div>
