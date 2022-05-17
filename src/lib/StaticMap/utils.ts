import { tile } from "d3-tile";
import type { GeoProjection } from "d3-geo";
import { MAPBOX_ACCESS_TOKEN } from "../common/mapbox";

export const getTileUrl = (
  x: number,
  y: number,
  z: number,
  style = "light-v10"
) =>
  `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/${z}/${x}/${y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;

export const getTiles = (
  width: number,
  height: number,
  projection: GeoProjection,
  tileSize = 512
) =>
  tile()
    .size([width, height])
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))
    .tileSize(tileSize);
