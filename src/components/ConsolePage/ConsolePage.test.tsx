// TextEncoder is not provided by jsdom but is required by react-router, set up the polyfill (first)
import { TextEncoder } from "util";
Object.assign(global, { TextEncoder });

import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ConsolePageLayout } from "./ConsolePage";

describe("ConsolePageLayout", () => {
  test("displays single page without navbar", () => {
    render(
      <MemoryRouter>
        <ConsolePageLayout title="test-title">
          <div data-testid="test-child">test-content</div>
        </ConsolePageLayout>
      </MemoryRouter>
    );

    // ensure title is rendered
    const title = screen.getByText("test-title");
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H2");

    // ensure {children} are rendered
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  test("displays multi page with navbar", () => {
    const routes = [
      {
        title: "Non-Default",
        path: "/nondefault",
        element: <div data-testid="nondefault-element"></div>,
      },
      {
        title: "Default",
        path: "/default",
        element: <div data-testid="default-element"></div>,
      },
    ];

    const { container } = render(
      <MemoryRouter initialEntries={["/default"]}>
        <ConsolePageLayout title="test-title" routes={routes} />
      </MemoryRouter>
    );

    // ensure title is rendered
    const title = screen.getByText("test-title");
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H2");

    // ensure navbar contains route links
    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
    const navLinks = nav!.querySelectorAll("a");
    expect(navLinks.length).toBe(routes.length);
    for (let i = 0; i < navLinks?.length, i++; ) {
      // ensure link properties match those passed by routes prop
      expect(navLinks[i].textContent).toBe(routes[i].title);
      expect(navLinks[i].href).toMatch(routes[i].path);
      // ensure default link is active
      if (routes[i].title == "Default") {
        expect(navLinks[i].classList).toContain("active");
      } else {
        expect(navLinks[i].classList).not.toContain("active");
      }
    }

    // ensure matching route is visible, non matching route is not
    expect(screen.getByTestId("default-element")).toBeInTheDocument();
    expect(screen.queryByTestId("nondefault-element")).not.toBeInTheDocument();
  });
});
