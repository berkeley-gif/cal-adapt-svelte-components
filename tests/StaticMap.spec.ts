/**
 * @jest-environment jsdom
 */
// import { prettyDOM } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import { StaticMap } from "../src/lib";
import * as locations from "../src/data/locations/";
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
        location
      }
    });
    const searchStr =
      "Locator map for 240 32nd Street, Sacramento, California 95816";
    expect(queryByText(searchStr)).toBeInTheDocument();
  });

  test("width and height", () => {
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

  // test("useButton", () => {});
});
