<script lang="ts">
  import { StaticMap } from "$lib";

  const location = {
    id: 37907,
    title: "240 32nd Street, Sacramento, California 95816",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-121.5, 38.625],
          [-121.4375, 38.625],
          [-121.4375, 38.5625],
          [-121.5, 38.5625],
          [-121.5, 38.625]
        ]
      ]
    },
    center: [-121.4688, 38.5938],
    bbox: [-121.5, 38.5625, -121.4375, 38.625]
  };
</script>

<h1>Static Map</h1>
<p>
  The Static Map is intended to be used within a tool's settings panel as a
  locator map for a location selected by the user.
</p>

<StaticMap location="{location}" />
