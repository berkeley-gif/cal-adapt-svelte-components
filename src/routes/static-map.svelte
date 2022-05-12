<script lang="ts">
  import { StaticMap } from "$lib";
  import type { Location } from "$lib/StaticMap/types";
  import _defaultLocation from "~/data/locations/default-location.json";

  const defaultLocation = _defaultLocation as Location;
</script>

<h1>Static Map</h1>
<p>
  The Static Map is intended to be used within a tool's settings panel as a
  locator map for a location selected by the user.
</p>

<StaticMap location="{defaultLocation}" />
