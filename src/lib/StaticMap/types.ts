import type { Geometry, Feature } from "geojson";

export type { Feature };

export type GeometryType = "Polygon" | "MultiPolygon" | "Point";
export type GeometryCoords = [number, number][][] | [number, number];
export type CenterCoords = [number, number];
export type BBoxCoords = [number, number, number, number];

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
  center: CenterCoords;
  bbox: BBoxCoords;
}

export interface Tiles extends Array<[number, number, number]> {
  scale: number;
  translate: [number, number];
}
