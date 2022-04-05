/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/svelte";
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
      props: {
        suggestions
      }
    });
    await component.$set({ description: "Search for a thing" });
    // label text
    expect(() => getByText("Search for a thing")).not.toThrow();
    // input placeholder text
    expect(() => getByPlaceholderText("Search for a thing")).not.toThrow();
  });

  test("listboxLabel prop", async () => {
    const { getByLabelText, getByRole } = render(Search, {
      target,
      props: {
        suggestions,
        listboxLabel: "Things"
      }
    });

    const input = getByRole("combobox") as HTMLInputElement;
    await fireEvent.focus(input);

    const listbox = getByLabelText(/things/i);
    expect(listbox).toBeTruthy();
  });

  test("searchValue prop", async () => {
    const searchValue = "two";
    const { getByRole } = render(Search, {
      target,
      props: { searchValue }
    });
    const input = getByRole("combobox") as HTMLInputElement;
    const result = input.value;
    expect(result).toEqual(searchValue);
  });

  test("suggestions prop", async () => {
    const { getAllByRole, getByRole, component } = render(Search, {
      target,
      props: { suggestions }
    });

    const input = getByRole("combobox") as HTMLInputElement;
    await fireEvent.focus(input);

    const options = getAllByRole("option") as HTMLDivElement[];
    expect(options).toHaveLength(3);

    await component.$set({ suggestions: [] });
    const listbox = getByRole("listbox");
    expect(listbox.querySelectorAll("*")).toHaveLength(0);
  });

  test("outlineColor prop", async () => {
    const { getByTestId } = render(Search, {
      target,
      props: { outlineColor: "magenta" }
    });
    const container = getByTestId("cac--search-container");
    const style = window.getComputedStyle(container);
    expect(style.getPropertyValue("--outline-color")).toBe("magenta");
  });

  test("inputId prop", async () => {
    const { getByRole } = render(Search, {
      target,
      props: {
        inputId: "custom-id",
        suggestions
      }
    });
    const input = getByRole("combobox");
    await fireEvent.focus(input);
    const label = document.getElementById("cac-label-custom-id");
    const listbox = getByRole("listbox");
    expect(input.getAttribute("id")).toBe("custom-id");
    expect(label).toBeTruthy();
    expect(listbox.getAttribute("id")).toBe("cac-listbox-custom-id");
  });
});
