import { tile } from "d3-tile";
import { MAPBOX_ACCESS_TOKEN } from "common/mapbox";

export const getTileUrl = (x: number, y: number, z: number) =>
  `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/${z}/${x}/${y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;

export const getTiles = (
  width: number,
  height: number,
  projection: any,
  tileSize = 512
) =>
  tile()
    .size([width, height])
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))
    .tileSize(tileSize);
