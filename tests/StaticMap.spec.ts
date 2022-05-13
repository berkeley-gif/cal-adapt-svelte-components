/**
 * @jest-environment jsdom
 */
// import { prettyDOM } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import { StaticMap } from "../src/lib";
import * as locations from "data/locations/";
import type { Location } from "$lib/StaticMap/types";

describe("StaticMap", () => {
  let target: HTMLSlotElement;
  let location: Location;

  beforeEach(() => {
    target = document.body.appendChild(document.createElement("slot"));
    location = locations.defaultLocation as Location;
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
  });

  test("SVG title", () => {
    const { queryByText } = render(StaticMap, {
      target,
      props: {
        location,
        titleId: "my-title"
      }
    });
    const searchStr =
      "Locator map for 240 32nd Street, Sacramento, California 95816";
    expect(queryByText(searchStr)).toBeInTheDocument();
    expect(queryByText(searchStr).getAttribute("id")).toEqual("my-title");
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
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  test("tile wraps svg", () => {
    const { queryByRole } = render(StaticMap, {
      target,
      props: {
        location,
        basemapStyle: "dark-v10",
        useButton: false
      }
    });
    const button = queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
});
