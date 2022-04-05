/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import Search from "./Search.svelte";

describe("Search", () => {
  let target;

  beforeEach(() => {
    target = document.body.appendChild(document.createElement("slot"));
  });

  test("should render", async () => {
    const result = render(Search);
    expect(result).toBeTruthy();
  });
});
