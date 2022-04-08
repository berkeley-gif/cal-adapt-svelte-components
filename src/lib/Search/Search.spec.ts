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

  test("clearSearch fn prop", async () => {
    const { getByRole, component } = render(Search, {
      target,
      props: {
        suggestions
      }
    });
    const input = getByRole("combobox") as HTMLInputElement;
    await fireEvent.focus(input);
    await component.$set({ searchValue: "foo" });
    await component.clearSearch();
    const listbox = getByRole("listbox");
    expect(input.value).toBe("");
    expect(
      listbox.querySelector(".bx--list-box__menu-item--highlighted")
    ).toBeNull();
  });

  test("clicking on an option selects a suggestion", async () => {
    const { getByRole, getAllByRole, component } = render(Search, {
      target,
      props: {
        suggestions
      }
    });
    const mock = jest.fn();
    const input = getByRole("combobox") as HTMLInputElement;
    component.$on("select", mock);
    await component.$set({ searchValue: "" });
    await fireEvent.focus(input);
    await component.$set({ searchValue: "thing" });
    const options = getAllByRole("option");
    await fireEvent.mouseEnter(options[1]);
    await fireEvent.click(options[1]);
    expect(mock.mock.calls[0][0].detail).toEqual({
      title: "Text for thing two",
      id: "b"
    });
  });

  test("external click event closes the listbox", async () => {
    const { getByRole, queryByRole } = render(Search, {
      target,
      props: {
        suggestions
      }
    });
    const input = getByRole("combobox") as HTMLInputElement;
    await fireEvent.focus(input);
    await fireEvent.click(document.body);
    const listbox = queryByRole("listbox");
    expect(listbox).toBeNull();
  });

  test("keydown enter selects a suggestion", async () => {
    const { getByRole, component } = render(Search, {
      target,
      props: {
        suggestions
      }
    });
    const mock = jest.fn();
    const result = { title: "Text for thing one", id: "a" };
    const input = getByRole("combobox") as HTMLInputElement;
    component.$on("select", mock);
    await fireEvent.focus(input);
    await component.$set({ searchValue: "one" });
    await fireEvent.keyDown(input, { key: "Enter" });
    expect(mock.mock.calls[0][0].detail).toEqual(result);
  });
});
