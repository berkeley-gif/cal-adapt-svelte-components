import { vi } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import { StaticMap } from "$lib";
//import defaultLocation from "~/static/data/locations/default-location.json";
//qimport stationLocation from "~/static/data/locations/station.json";
import type { Location } from "$lib/StaticMap/types";

// Importing json file is resulting in "Error: Failed to parse JSON file."
// Maybe related to this issue in vite https://github.com/vitejs/vite/issues/8611
// So defaultLocation and stationLocation are defined below for now
const defaultLocation = {
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

const stationLocation = {
  title:
    "Weather Station at Fresno Yosemite International Airport, Fresno, California",
  geometry: {
    type: "Point",
    coordinates: [-119.719, 36.78]
  },
  center: [-119.719, 36.78],
  bbox: [-119.719, 36.78, -119.719, 36.78],
  id: 11,
  properties: {
    name: "Fresno Yosemite International Airport",
    usaf: 723890,
    wban: 93193,
    elevation_m: 101.5,
    icao: "KFAT",
    city: "Fresno",
    climdiv: 5
  }
};

describe("StaticMap", () => {
  let target: HTMLSlotElement;
  let location: Location;

  beforeEach(() => {
    target = document.body.appendChild(document.createElement("slot"));
    location = defaultLocation as Location;
  });

  test("Component should render", async () => {
    const result = render(StaticMap);
    expect(result).toBeTruthy();
  });

  test("Basemap tiles render", () => {
    const { queryByRole } = render(StaticMap, {
      target,
      props: {
        location
      }
    });
    const svg = queryByRole("img");
    expect(svg.querySelectorAll("image").length).toBeGreaterThan(0);
  });

  test("Overlay vector renders", () => {
    const { queryByRole } = render(StaticMap, {
      target,
      props: {
        location
      }
    });
    const svg = queryByRole("img");
    expect(svg.querySelector("path")).toBeInTheDocument();
    expect(svg.querySelector("svg")).not.toBeInTheDocument();
  });

  test("Marker renders for point geoms", () => {
    const { queryByRole } = render(StaticMap, {
      target,
      props: {
        location: stationLocation
      }
    });
    const svg = queryByRole("img");
    expect(svg.querySelector("svg")).toBeInTheDocument();
  });

  test("SVG title", () => {
    const titleId = "my-title";
    const { queryByText, queryByRole } = render(StaticMap, {
      target,
      props: {
        location,
        titleId
      }
    });
    const svg = queryByRole("img");
    const searchStr =
      "Locator map for 240 32nd Street, Sacramento, California 95816";
    expect(queryByText(searchStr)).toBeInTheDocument();
    expect(queryByText(searchStr).getAttribute("id")).toEqual(titleId);
    expect(svg.getAttribute("aria-labelledby")).toEqual(titleId);
  });

  test("SVG viewBox attribute", () => {
    const { queryByRole } = render(StaticMap, {
      target,
      props: {
        location,
        width: 300,
        height: 500
      }
    });
    const svg = queryByRole("img");
    const expected = "0 0 300 500";
    expect(svg.getAttribute("viewBox")).toEqual(expected);
  });

  test("container dimensions", () => {
    const { queryByTestId } = render(StaticMap, {
      target,
      props: {
        location,
        width: 300,
        height: 500
      }
    });
    const container = queryByTestId("cac-static-map-container");
    const styles = getComputedStyle(container);
    // Note: for some reason "width" and "height" CSS props are not defined
    expect(styles.getPropertyValue("--width")).toEqual("300px");
    expect(styles.getPropertyValue("--height")).toEqual("500px");
  });

  test("basemap style", () => {
    const { queryByRole } = render(StaticMap, {
      target,
      props: {
        location,
        basemapStyle: "dark-v10"
      }
    });
    const svg = queryByRole("img");
    const images = svg.querySelectorAll("image");
    const urls = Array.from(images).map((el) => el.getAttribute("xlink:href"));
    const result = urls.every((url) => url.includes("dark-v10"));
    expect(result).toBe(true);
  });

  test("button wraps svg", () => {
    const { queryByRole } = render(StaticMap, {
      target,
      props: {
        location,
        basemapStyle: "dark-v10"
      }
    });
    const button = queryByRole("button");
    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();
    expect(button.getAttribute("aria-label")).toBeTruthy();
  });

  test("tile wraps svg", () => {
    const { queryByRole, getByTestId } = render(StaticMap, {
      target,
      props: {
        location,
        basemapStyle: "dark-v10",
        useButton: false
      }
    });
    const container = getByTestId("cac-static-map-container");
    const button = queryByRole("button");
    expect(button).not.toBeInTheDocument();
    expect(container.querySelector("div")).toBeInTheDocument();
    expect(
      container.querySelector("div").getAttribute("aria-label")
    ).toBeNull();
  });

  // NOTE: the component's projection does not seem to update correctly,
  // when using JSDOM, therefore it's difficult to test the zoom prop.
  test.skip("zoom prop", async () => {
    const { component, queryByRole } = render(StaticMap, {
      target,
      props: {
        location,
        zoom: 18
      }
    });

    const svg = queryByRole("img");
    const getPositions = () =>
      Array.from(svg.querySelectorAll("image")).map((el) => ({
        x: +el.getAttribute("x"),
        y: +el.getAttribute("y")
      }));
    console.log(getPositions());
    await component.$set({ zoom: 22 });
    console.log(getPositions());
  });

  test("on:click", async () => {
    const { queryByRole, component } = render(StaticMap, {
      target,
      props: {
        location
      }
    });
    const mock = vi.fn();
    const button = queryByRole("button");
    component.$on("click", mock);
    await fireEvent.click(button);
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
