import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import {
  AboutPetraWeb,
  AboutPetraWebEducationScreen,
  EXPLORE_ECOSYSTEM_URL,
} from "../../src/components/AboutPetraWeb";

describe("AboutPetraWeb", () => {
  const renderEducationScreen = vi.fn(
    (educationScreen: AboutPetraWebEducationScreen) => (
      <div data-testid="education-screen">
        <educationScreen.Graphic aria-label="education-graphic" />
        <educationScreen.Title />
        <educationScreen.Description />
        <div data-testid="screen-index">{educationScreen.screenIndex}</div>
        <div data-testid="total-screens">{educationScreen.totalScreens}</div>
        <button onClick={educationScreen.back}>Back</button>
        <button onClick={educationScreen.next}>Next</button>
        <button onClick={educationScreen.cancel}>Cancel</button>
        {educationScreen.screenIndicators.map((Indicator, index) => (
          <Indicator key={index}>{`Indicator ${index}`}</Indicator>
        ))}
      </div>
    )
  );

  beforeEach(() => {
    renderEducationScreen.mockClear();
  });

  describe("initial rendering", () => {
    it("should render children initially (screenIndex 0)", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <div data-testid="wallet-selection">Wallet Selection</div>
        </AboutPetraWeb>
      );

      expect(screen.getByTestId("wallet-selection")).toBeInTheDocument();
      expect(screen.queryByTestId("education-screen")).not.toBeInTheDocument();
    });
  });

  describe("Trigger component", () => {
    it("should navigate to first education screen when clicked", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));

      expect(screen.getByTestId("education-screen")).toBeInTheDocument();
      expect(renderEducationScreen).toHaveBeenCalledTimes(1);
    });

    it("should throw when used outside AboutPetraWeb context", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>);
      }).toThrow("`AboutPetraWeb.Trigger` must be used within `AboutPetraWeb`");

      consoleSpy.mockRestore();
    });
  });

  describe("education screen navigation", () => {
    it("should provide correct screen index and total screens", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));

      expect(screen.getByTestId("screen-index")).toHaveTextContent("0");
      expect(screen.getByTestId("total-screens")).toHaveTextContent("3");
    });

    it("should navigate to next screen when next is called", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));

      expect(screen.getByTestId("screen-index")).toHaveTextContent("1");
    });

    it("should navigate to previous screen when back is called", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      // Navigate to screen 1, then screen 2, then back
      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.click(screen.getByRole("button", { name: "Back" }));

      expect(screen.getByTestId("screen-index")).toHaveTextContent("0");
    });

    it("should return to wallet selection when cancel is called", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <div data-testid="wallet-selection">Wallet Selection</div>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));
      expect(screen.queryByTestId("wallet-selection")).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      expect(screen.getByTestId("wallet-selection")).toBeInTheDocument();
    });

    it("should return to wallet selection when navigating past last screen", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <div data-testid="wallet-selection">Wallet Selection</div>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));
      // Navigate through all screens (0, 1, 2, then back to 0)
      fireEvent.click(screen.getByRole("button", { name: "Next" })); // screen 1
      fireEvent.click(screen.getByRole("button", { name: "Next" })); // screen 2
      fireEvent.click(screen.getByRole("button", { name: "Next" })); // back to wallet selection

      expect(screen.getByTestId("wallet-selection")).toBeInTheDocument();
    });
  });

  describe("screen indicators", () => {
    it("should provide screen indicators for each education screen", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));

      // Should have 3 indicators for 3 education screens (aria-label is "Go to screen N")
      expect(screen.getByRole("button", { name: "Go to screen 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to screen 2" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Go to screen 3" })).toBeInTheDocument();
    });

    it("should navigate to specific screen when indicator is clicked", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));
      // Click third indicator (Go to screen 3) which is index 2
      fireEvent.click(screen.getByRole("button", { name: "Go to screen 3" }));

      expect(screen.getByTestId("screen-index")).toHaveTextContent("2");
    });
  });

  describe("education screen content", () => {
    it("should render Graphic component", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));

      expect(screen.getByLabelText("education-graphic")).toBeInTheDocument();
    });

    it("should render Title component with correct content", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));

      // First screen title
      expect(screen.getByRole("heading", { name: "A better way to login." })).toBeInTheDocument();
    });

    it("should render Description component", () => {
      render(
        <AboutPetraWeb renderEducationScreen={renderEducationScreen}>
          <AboutPetraWeb.Trigger>Learn More</AboutPetraWeb.Trigger>
        </AboutPetraWeb>
      );

      fireEvent.click(screen.getByRole("button", { name: "Learn More" }));

      // First screen description contains this text
      expect(
        screen.getByText(/Petra Web is a web3 wallet/)
      ).toBeInTheDocument();
    });
  });

  describe("constants", () => {
    it("should export EXPLORE_ECOSYSTEM_URL", () => {
      expect(EXPLORE_ECOSYSTEM_URL).toBe(
        "https://aptosnetwork.com/ecosystem/directory/category/defi"
      );
    });
  });
});
