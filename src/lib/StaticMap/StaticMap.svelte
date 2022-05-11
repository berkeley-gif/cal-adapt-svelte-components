<script lang="ts">
  interface Location {
    id: number;
    title: string;
    geometry: {
      type: "Polygon" | "MultiPolygon" | "Point";
      coordinates: [number[]] | number[];
    };
    center: [number, number];
    bbox: [number, number, number, number];
  }

  type MapBoxStyle =
    | "streets-v11"
    | "light-v10"
    | "dark-v10"
    | "satellite-v9"
    | "satellite-streets-v11";

  /** specify the height of the map */
  export let height = 150;

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
</script>

<div>
  <pre>
  {height}
  {JSON.stringify(location)}
  {style}
  {padding}
  {zoom}
  {useButton}
  </pre>
</div>
