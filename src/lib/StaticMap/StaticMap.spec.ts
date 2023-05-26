import { render, fireEvent } from "@testing-library/svelte";
import { vi } from "vitest";
import { StaticMap } from "$lib";
import type { Location } from "$lib/types";
import { readFile } from "fs/promises";

// Importing the following json files is resulting in "Error: Failed to parse JSON file."
// Possibly related to this issue in vite https://github.com/vitejs/vite/issues/8611
//import defaultLocation from "../../../static/data/locations/default-location.json";
//import stationLocation from "../../../static/data/locations/station.json";

let defaultLocation: Location;
let stationLocation: Location;

describe("StaticMap", async () => {
  // Using nodejs builtin readFile method to read json file as a workaround
  try {
    const defaultString = await readFile(
      `${process.env.PWD}/static/data/locations/default-location.json`,
      "utf8"
    );
    defaultLocation = JSON.parse(defaultString);
    const stationString = await readFile(
      `${process.env.PWD}/static/data/locations/station.json`,
      "utf8"
    );
    stationLocation = JSON.parse(stationString);
  } catch (error) {
    console.error("Failed to read json files", error);
  }

  test("Component should render", async () => {
    const result = render(StaticMap);
    expect(result).toBeTruthy();
  });

  test("Basemap tiles render", () => {
    const { queryByRole } = render(StaticMap, {
      props: {
        location: defaultLocation
      }
    });
    const svg = queryByRole("img") as HTMLElement;
    expect(svg.querySelectorAll("image").length).toBeGreaterThan(0);
  });

  test("Overlay vector renders", () => {
    const { queryByRole } = render(StaticMap, {
      props: {
        location: defaultLocation
      }
    });
    const svg = queryByRole("img") as HTMLElement;
    expect(svg.querySelector("path")).toBeInTheDocument();
    expect(svg.querySelector("svg")).not.toBeInTheDocument();
  });

  test("Marker renders for point geoms", () => {
    const { queryByRole } = render(StaticMap, {
      props: {
        location: stationLocation
      }
    });
    const svg = queryByRole("img") as HTMLElement;
    expect(svg.querySelector("svg")).toBeInTheDocument();
  });

  test("SVG title", () => {
    const titleId = "my-title";
    const { queryByText, queryByRole } = render(StaticMap, {
      props: {
        location: defaultLocation,
        titleId
      }
    });
    const svg = queryByRole("img") as HTMLElement;
    const searchStr =
      "Locator map for 240 32nd Street, Sacramento, California 95816";
    expect(queryByText(searchStr)).toBeInTheDocument();
    expect(queryByText(searchStr)?.getAttribute("id")).toEqual(titleId);
    expect(svg.getAttribute("aria-labelledby")).toEqual(titleId);
  });

  test("SVG viewBox attribute", () => {
    const { queryByRole } = render(StaticMap, {
      props: {
        location: defaultLocation,
        width: 300,
        height: 500
      }
    });
    const svg = queryByRole("img") as HTMLElement;
    const expected = "0 0 300 500";
    expect(svg.getAttribute("viewBox")).toEqual(expected);
  });

  test("container dimensions", () => {
    const { queryByTestId } = render(StaticMap, {
      props: {
        location: defaultLocation,
        width: 300,
        height: 500
      }
    });
    const container = queryByTestId("cac-static-map-container") as HTMLElement;
    const styles = getComputedStyle(container);
    // Note: for some reason "width" and "height" CSS props are not defined
    expect(styles.getPropertyValue("--width")).toEqual("300px");
    expect(styles.getPropertyValue("--height")).toEqual("500px");
  });

  test("basemap style", () => {
    const { queryByRole } = render(StaticMap, {
      props: {
        location: defaultLocation,
        basemapStyle: "dark-v10"
      }
    });
    const svg = queryByRole("img") as HTMLElement;
    const images = svg.querySelectorAll("image");
    const urls = Array.from(images).map((el) => el.getAttribute("xlink:href"));
    const result = urls.every((url) => url?.includes("dark-v10"));
    expect(result).toBe(true);
  });

  test("button wraps svg", () => {
    const { queryByRole } = render(StaticMap, {
      props: {
        location: defaultLocation,
        basemapStyle: "dark-v10"
      }
    });
    const button = queryByRole("button") as HTMLElement;
    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();
    expect(button.getAttribute("aria-label")).toBeTruthy();
  });

  test("tile wraps svg", () => {
    const { queryByRole, getByTestId } = render(StaticMap, {
      props: {
        location: defaultLocation,
        basemapStyle: "dark-v10",
        useButton: false
      }
    });
    const container = getByTestId("cac-static-map-container");
    const button = queryByRole("button");
    expect(button).not.toBeInTheDocument();
    expect(container.querySelector("div")).toBeInTheDocument();
    expect(
      container.querySelector("div")?.getAttribute("aria-label")
    ).toBeNull();
  });

  // NOTE: the component's projection does not seem to update correctly,
  // when using JSDOM, therefore it's difficult to test the zoom prop.
  test.skip("zoom prop", async () => {
    const { component, queryByRole } = render(StaticMap, {
      props: {
        location: defaultLocation,
        zoom: 18
      }
    });

    const svg = queryByRole("img") as HTMLElement;
    const getPositions = () =>
      Array.from(svg.querySelectorAll("image")).map((el) => {
        const image: SVGImageElement = el;
        return {
          x: image.getAttribute("x"),
          y: image.getAttribute("y")
        };
      });
    console.log(getPositions());
    await component.$set({ zoom: 22 });
    console.log(getPositions());
  });

  test("on:click", async () => {
    const { queryByRole, component } = render(StaticMap, {
      props: {
        location: defaultLocation
      }
    });
    const mock = vi.fn();
    const button = queryByRole("button") as HTMLButtonElement;
    component.$on("click", mock);
    await fireEvent.click(button);
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
