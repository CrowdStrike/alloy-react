import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import { ConsoleExtension } from "./ConsoleExtension";

describe("ConsoleExtension", () => {
  test("renders children", () => {
    render(
      <ConsoleExtension>
        <div data-testid="test-child">test-content</div>
      </ConsoleExtension>
    );
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });
});
