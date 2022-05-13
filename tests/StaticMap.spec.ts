/**
 * @jest-environment jsdom
 */
// import { prettyDOM } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/svelte";
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
    const { queryByText, queryByRole } = render(StaticMap, {
      target,
      props: {
        location,
        titleId: "my-title"
      }
    });
    const svg = queryByRole("img");
    const searchStr =
      "Locator map for 240 32nd Street, Sacramento, California 95816";
    expect(queryByText(searchStr)).toBeInTheDocument();
    expect(queryByText(searchStr).getAttribute("id")).toEqual("my-title");
    expect(svg.getAttribute("aria-labelledby")).toEqual("my-title");
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
    expect(button.getAttribute("aria-label")).toEqual("Change location");
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

  test("on:click", async () => {
    const { queryByRole, component } = render(StaticMap, {
      target,
      props: {
        location,
        basemapStyle: "dark-v10"
      }
    });
    const mock = jest.fn();
    const button = queryByRole("button");
    component.$on("click", mock);
    await fireEvent.click(button);
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
