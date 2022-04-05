/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import Search from "./Search.svelte";

describe("Search", () => {
  let target;
  let suggestions;

  beforeEach(() => {
    target = document.body.appendChild(document.createElement("slot"));
    suggestions = [
      {
        title: "Text for thing one",
        id: "a"
      },
      {
        title: "Text for thing two",
        id: "b"
      },
      {
        title: "Text for thing three",
        id: "c"
      }
    ];
  });

  test("should render", async () => {
    const result = render(Search);
    expect(result).toBeTruthy();
  });

  test("description prop", async () => {
    const { getByText, getByPlaceholderText, component } = render(Search, {
      target,
      suggestions
    });
    await component.$set({ description: "Search for a thing" });
    // label text
    expect(() => getByText("Search for a thing")).not.toThrow();
    // input placeholder text
    expect(() => getByPlaceholderText("Search for a thing")).not.toThrow();
  });

  test("searchValue prop", async () => {
    const searchValue = "two";
    const { getByRole } = render(Search, {
      target,
      searchValue
    });
    const input = getByRole("combobox") as HTMLInputElement;
    const result = input.value;
    expect(result).toEqual(searchValue);
  });
});
