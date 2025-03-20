// TextEncoder is not provided by jsdom but is required by react-router, set up the polyfill (first)
import { TextEncoder } from "util";
Object.assign(global, { TextEncoder });

import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { fireEvent, render, screen, within } from "@testing-library/react";
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

  test("displays multi page with working navbar", () => {
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

    render(
      <MemoryRouter initialEntries={["/default"]}>
        <ConsolePageLayout title="test-title" routes={routes} />
      </MemoryRouter>
    );

    // ensure title is rendered
    expect(
      screen.getByRole("heading", { name: "test-title" })
    ).toBeInTheDocument();

    // ensure navbar contains route links
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(within(nav).getAllByRole("link")).toHaveLength(routes.length);

    // ensure default link is active and vice versa
    expect(screen.getByText("Default")).toHaveClass("active");
    expect(screen.getByText("Non-Default")).not.toHaveClass("active");

    // ensure matching route is displayed, non matching route is not
    expect(screen.getByTestId("default-element")).toBeInTheDocument();
    expect(screen.queryByTestId("nondefault-element")).not.toBeInTheDocument();

    // change routes
    fireEvent.click(screen.getByText("Non-Default"));

    // check nav link active class changes
    expect(screen.getByText("Default")).not.toHaveClass("active");
    expect(screen.getByText("Non-Default")).toHaveClass("active");

    // ensure new route is visible, old route is not
    expect(screen.queryByTestId("default-element")).not.toBeInTheDocument();
    expect(screen.getByTestId("nondefault-element")).toBeInTheDocument();
  });
});
