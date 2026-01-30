import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React, { createRef } from "react";
import { createHeadlessComponent } from "../../src/components/utils";

describe("createHeadlessComponent", () => {
  describe("basic rendering", () => {
    it("should create a component with the correct displayName", () => {
      const TestComponent = createHeadlessComponent("TestComponent", "div");
      expect(TestComponent.displayName).toBe("TestComponent");
    });

    it("should render the default element type", () => {
      const TestDiv = createHeadlessComponent("TestDiv", "div", {
        children: "Test Content",
      });
      render(<TestDiv />);

      expect(screen.getByText("Test Content").tagName).toBe("DIV");
    });

    it("should render different element types", () => {
      const TestButton = createHeadlessComponent("TestButton", "button", {
        children: "Click Me",
      });
      render(<TestButton />);

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("button").tagName).toBe("BUTTON");
    });

    it("should render an img element with props", () => {
      const TestImg = createHeadlessComponent("TestImg", "img", {
        src: "test.png",
        alt: "test image",
      });
      render(<TestImg />);

      const img = screen.getByAltText("test image");
      expect(img.tagName).toBe("IMG");
      expect(img).toHaveAttribute("src", "test.png");
    });
  });

  describe("className prop", () => {
    it("should apply className to the element", () => {
      const TestComponent = createHeadlessComponent("TestComponent", "div", {
        children: "Styled Content",
      });
      render(<TestComponent className="test-class" />);

      expect(screen.getByText("Styled Content")).toHaveClass("test-class");
    });
  });

  describe("default props", () => {
    it("should apply static default props", () => {
      const TestComponent = createHeadlessComponent("TestComponent", "a", {
        href: "https://example.com",
        target: "_blank",
        children: "Link",
      });
      render(<TestComponent />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "https://example.com");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("should apply props from a function", () => {
      const TestComponent = createHeadlessComponent(
        "TestComponent",
        "button",
        (displayName) => ({
          "aria-label": `Button created by ${displayName}`,
          children: "Dynamic Button",
        })
      );
      render(<TestComponent />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "aria-label",
        "Button created by TestComponent"
      );
    });
  });

  describe("children", () => {
    it("should render default children from props", () => {
      const TestComponent = createHeadlessComponent("TestComponent", "div", {
        children: "Default Content",
      });
      render(<TestComponent />);

      expect(screen.getByText("Default Content")).toBeInTheDocument();
    });

    it("should allow children to override default children", () => {
      const TestComponent = createHeadlessComponent("TestComponent", "div", {
        children: "Default Content",
      });
      render(<TestComponent>Custom Content</TestComponent>);

      expect(screen.getByText("Custom Content")).toBeInTheDocument();
      expect(screen.queryByText("Default Content")).not.toBeInTheDocument();
    });

    it("should render children when no default is provided", () => {
      const TestComponent = createHeadlessComponent("TestComponent", "div");
      render(<TestComponent>Child Content</TestComponent>);

      expect(screen.getByText("Child Content")).toBeInTheDocument();
    });
  });

  describe("asChild prop", () => {
    it("should render as the child element when asChild is true", () => {
      const TestComponent = createHeadlessComponent("TestComponent", "div", {
        children: "Default",
      });
      render(
        <TestComponent asChild>
          <button>Click me</button>
        </TestComponent>
      );

      // The Slot component merges props onto the child
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("button").tagName).toBe("BUTTON");
    });

    it("should merge className when using asChild", () => {
      const TestComponent = createHeadlessComponent("TestComponent", "div");
      render(
        <TestComponent asChild className="parent-class">
          <button className="child-class">Click me</button>
        </TestComponent>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("parent-class");
      expect(button).toHaveClass("child-class");
    });
  });

  describe("ref forwarding", () => {
    it("should forward ref to the element", () => {
      const TestComponent = createHeadlessComponent("TestComponent", "div", {
        children: "Ref Test",
      });
      const ref = createRef<HTMLDivElement>();

      render(<TestComponent ref={ref} />);

      expect(ref.current).toBe(screen.getByText("Ref Test"));
    });

    it("should forward ref to button element", () => {
      const TestButton = createHeadlessComponent("TestButton", "button", {
        children: "Button Ref Test",
      });
      const ref = createRef<HTMLButtonElement>();

      render(<TestButton ref={ref} />);

      expect(ref.current).toBe(screen.getByRole("button"));
      expect(ref.current?.tagName).toBe("BUTTON");
    });
  });
});
