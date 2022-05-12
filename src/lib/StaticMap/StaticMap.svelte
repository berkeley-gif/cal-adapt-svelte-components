<script lang="ts">
  import * as d3 from "d3-geo";
  import Button from "carbon-components-svelte/src/Button/Button.svelte";
  import Tile from "carbon-components-svelte/src/Tile/Tile.svelte";

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

  /** wrap the map in an HTML button element or not */
  export let useButton = true;

  const projection = d3.geoMercator();
  const path = d3.geoPath(projection);

  let tiles: Tiles;
  let tx: number;
  let ty: number;
  let k: number;
  let overlay: Feature;

  $: Wrapper = useButton ? Button : Tile;

  $: {
    if (location) {
      createOverlay();
      setProjection();
      tiles = getTiles(width, height, projection)();
      [tx, ty] = tiles.translate;
      k = tiles.scale;
    }
  }

  function createOverlay() {
    console.log("createOverlay");
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
  .container {
    display: inline-block;
    box-sizing: content-box;
    border: 1px solid var(--border-color, var(--gray-90));
    width: var(--width, 250px);
    height: var(--height, 250px);
  }

  /* stylelint-disable-next-line */
  .container > :global(.bx--btn.bx--btn--primary) {
    all: unset;
    width: var(--width, 250px);
    cursor: pointer;

    &:hover {
      box-shadow: var(--box-shadow);
    }

    &:focus {
      outline: 2px solid var(--gray-100);
    }
  }

  /* stylelint-disable-next-line */
  .container > :global(.bx--tile) {
    width: var(--width, 250px);
    padding: 0;
  }

  svg {
    display: inline-block;
  }

  path {
    stroke: var(--stroke, var(--gray-90));
    stroke-width: var(--stroke-width, 3);
  }
</style>

<div class="container" style="--width:{width}px; --height:{height}px">
  <svelte:component this="{Wrapper}" on:click>
    <svg viewBox="0 0 {width} {height}" overflow="hidden">
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
        <path fill="none" d="{path(overlay)}"></path>
      {/if}
    </svg>
  </svelte:component>
</div>
