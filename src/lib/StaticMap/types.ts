import type { Geometry, Feature, BBox, Position } from "geojson";

export type { Feature };

export type MapBoxStyle =
  | "streets-v11"
  | "light-v10"
  | "dark-v10"
  | "satellite-v9"
  | "satellite-streets-v11";

/** represents location data from a locationStore in Cal-Adapt */
export interface Location {
  id: number;
  title: string;
  geometry: Geometry;
  center: Position;
  bbox: BBox;
}

export interface Tiles extends Array<[number, number, number]> {
  scale: number;
  translate: [number, number];
}
