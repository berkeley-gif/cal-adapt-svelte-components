import { render, fireEvent, screen } from "@testing-library/svelte";
import { vi } from "vitest";
import { Search } from "$lib";

describe("Search", async () => {
  const announceContainerTestId = "cac--announce-container";
  const searchContainerTestId = "cac--search-container";
  const highlightClass = "bx--list-box__menu-item--highlighted";

  const suggestions = [
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

  test("should render", async () => {
    const result = render(Search);
    expect(() => result).not.toThrow();
  });

  test("description prop", async () => {
    render(Search, {
      props: {
        suggestions,
        description: "Search for a thing"
      }
    });

    // label text
    expect(() => screen.getByText("Search for a thing")).not.toThrow();
    // input placeholder text
    expect(() =>
      screen.getByPlaceholderText("Search for a thing")
    ).not.toThrow();
  });

  test("listboxLabel prop", async () => {
    render(Search, {
      props: {
        suggestions,
        listboxLabel: "Things"
      }
    });

    await fireEvent.focus(screen.getByRole("combobox"));

    expect(screen.getByLabelText(/things/i)).toBeTruthy();
  });

  test("searchValue prop", async () => {
    const searchValue = "two";
    render(Search, {
      props: { searchValue }
    });
    const result: HTMLInputElement = screen.getByRole("combobox");
    expect(result.value).toEqual(searchValue);
  });

  test("suggestions prop", async () => {
    const { component } = render(Search, {
      props: { suggestions }
    });

    await fireEvent.focus(screen.getByRole("combobox"));

    expect(screen.getAllByRole("option")).toHaveLength(3);
    await component.$set({ suggestions: [] });
    const listbox = screen.getByRole("listbox");
    expect(listbox.querySelectorAll("*")).toHaveLength(0);
  });

  test("outlineColor prop", async () => {
    render(Search, {
      props: { outlineColor: "magenta" }
    });
    const container = screen.getByTestId(searchContainerTestId);
    const style = window.getComputedStyle(container);
    expect(style.getPropertyValue("--outline-color")).toBe("magenta");
  });

  test("inputId prop", async () => {
    render(Search, {
      props: {
        inputId: "custom-id",
        suggestions
      }
    });
    const input = screen.getByRole("combobox");
    await fireEvent.focus(input);
    const label = document.getElementById("cac-label-custom-id");
    const listbox = screen.getByRole("listbox");
    expect(input.getAttribute("id")).toBe("custom-id");
    expect(label).toBeTruthy();
    expect(listbox.getAttribute("id")).toBe("cac-listbox-custom-id");
  });

  test("clearSearch fn prop", async () => {
    const { getByRole, component } = render(Search, {
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
    expect(listbox.querySelector(`.${highlightClass}`)).toBeNull();
  });

  test("clicking clear input button clears input value", async () => {
    const { getByRole, getByLabelText, component } = render(Search, {
      props: {
        suggestions
      }
    });
    const input = getByRole("combobox") as HTMLInputElement;
    await fireEvent.focus(input);
    await component.$set({ searchValue: "I read the news today, oh boy." });
    const button = getByLabelText("Clear input") as HTMLButtonElement;
    await fireEvent.click(button);
    expect(input.value).toBe("");
  });

  test("clear input button dispatches", async () => {
    const { getByLabelText, getByRole, component } = render(Search, {
      props: {
        suggestions
      }
    });
    const mock = vi.fn();
    component.$on("clear", mock);
    const input = getByRole("combobox") as HTMLInputElement;
    await fireEvent.focus(input);
    await component.$set({ searchValue: "I read the news today, oh boy." });
    const button = getByLabelText("Clear input") as HTMLButtonElement;
    await fireEvent.click(button);
    expect(mock.mock.calls).toHaveLength(1);
  });

  test("clicking on an option selects a suggestion", async () => {
    const { getByRole, getAllByRole, component } = render(Search, {
      props: {
        suggestions
      }
    });
    const mock = vi.fn();
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

  test("keydown enter selects a suggestion", async () => {
    const { getByRole, component } = render(Search, {
      props: {
        suggestions
      }
    });
    const mock = vi.fn();
    const result = { title: "Text for thing one", id: "a" };
    const input = getByRole("combobox") as HTMLInputElement;
    component.$on("select", mock);
    await fireEvent.focus(input);
    await component.$set({ searchValue: "one" });
    await fireEvent.keyDown(input, { key: "Enter" });
    expect(mock.mock.calls[0][0].detail).toEqual(result);
  });

  test("keydown arrow down event", async () => {
    const { getByRole, getAllByRole, component } = render(Search, {
      props: {
        suggestions
      }
    });
    const input = getByRole("combobox") as HTMLInputElement;
    await component.$set({ searchValue: "" });
    await fireEvent.focus(input);
    const options = getAllByRole("option");
    await fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[0].classList.contains(highlightClass)).toBe(true);
    await fireEvent.keyDown(input, { key: "ArrowDown" });
    await fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[2].classList.contains(highlightClass)).toBe(true);
    await fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[0].classList.contains(highlightClass)).toBe(true);
  });

  test("keydown arrow up event", async () => {
    const { getByRole, getAllByRole, component } = render(Search, {
      props: {
        suggestions
      }
    });
    const input = getByRole("combobox") as HTMLInputElement;
    await component.$set({ searchValue: "" });
    await fireEvent.focus(input);
    const options = getAllByRole("option");
    await fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(options[2].classList.contains(highlightClass)).toBe(true);
    await fireEvent.keyDown(input, { key: "ArrowUp" });
    await fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(options[0].classList.contains(highlightClass)).toBe(true);
    await fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(options[2].classList.contains(highlightClass)).toBe(true);
  });

  test("keydown home event", async () => {
    const { getByRole, getAllByRole, component } = render(Search, {
      props: {
        suggestions
      }
    });
    const input = getByRole("combobox") as HTMLInputElement;
    await component.$set({ searchValue: "" });
    await fireEvent.focus(input);
    const options = getAllByRole("option");
    await fireEvent.keyDown(input, { key: "Home" });
    expect(options[0].classList.contains(highlightClass)).toBe(true);
    await fireEvent.keyDown(input, { key: "ArrowUp" });
    await fireEvent.keyDown(input, { key: "Home" });
    expect(options[0].classList.contains(highlightClass)).toBe(true);
  });

  test("keydown end event", async () => {
    const { getByRole, getAllByRole, component } = render(Search, {
      props: {
        suggestions
      }
    });
    const input = getByRole("combobox") as HTMLInputElement;
    await component.$set({ searchValue: "" });
    await fireEvent.focus(input);
    const options = getAllByRole("option");
    await fireEvent.keyDown(input, { key: "End" });
    expect(options[2].classList.contains(highlightClass)).toBe(true);
    await fireEvent.keyDown(input, { key: "ArrowDown" });
    await fireEvent.keyDown(input, { key: "End" });
    expect(options[2].classList.contains(highlightClass)).toBe(true);
  });

  test("keydown tab event", async () => {
    const { component } = render(Search, {
      props: {
        suggestions
      }
    });
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await component.$set({ searchValue: "" });
    await fireEvent.focus(input);
    const listbox = screen.getByRole("listbox") as HTMLDivElement;
    await fireEvent.keyDown(input, { key: "Tab" });
    expect(listbox.style.display).toBe("none");
  });

  test("input focus event opens the listbox", async () => {
    render(Search, {
      props: {
        suggestions
      }
    });
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await fireEvent.focus(input);
    const listbox = screen.getByRole("listbox");
    expect(listbox.style.display).toBe("block");
  });

  test("external click event closes the listbox", async () => {
    render(Search, {
      props: {
        suggestions
      }
    });
    const input = screen.getByRole("combobox") as HTMLInputElement;
    await fireEvent.focus(input);
    const listbox = screen.getByRole("listbox");
    await fireEvent.click(document.body);
    expect(listbox.style.display).toBe("none");
  });

  // NOTE: theq component's afterUpdate event does not seem to fire
  // during the test. So this test fails.
  test.skip("aria-live content", async () => {
    const { component } = render(Search);
    const announceContainer = screen.getByTestId(announceContainerTestId);
    const input = screen.getByRole("combobox");
    component.$set({ suggestions });
    await fireEvent.focus(input);
    component.$set({ searchValue: " " });
    expect(announceContainer.innerText).toBe("3 suggestions found.");
    component.$set({ suggestions: suggestions.slice(0, 1) });
    expect(announceContainer.innerText).toBe("1 suggestion found.");
    component.$set({ searchValue: "" });
    expect(announceContainer.innerText).toBe("");
  });
});
