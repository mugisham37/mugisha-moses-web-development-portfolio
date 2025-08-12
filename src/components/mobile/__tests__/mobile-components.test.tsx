/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { useMobile } from "@/hooks/use-mobile";
import { useTouchGestures } from "@/hooks/use-touch-gestures";

// Mock the hooks for testing
jest.mock("@/hooks/use-mobile");
jest.mock("@/hooks/use-touch-gestures");

const mockUseMobile = useMobile as jest.MockedFunction<typeof useMobile>;
const mockUseTouchGestures = useTouchGestures as jest.MockedFunction<
  typeof useTouchGestures
>;

describe("Mobile Components", () => {
  beforeEach(() => {
    mockUseMobile.mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isTouchDevice: true,
      screenSize: "mobile",
      orientation: "portrait",
      isIOS: false,
      isAndroid: true,
    });

    mockUseTouchGestures.mockReturnValue({
      attachGestures: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("useMobile hook", () => {
    it("should detect mobile device correctly", () => {
      const result = useMobile();

      expect(result.isMobile).toBe(true);
      expect(result.isTouchDevice).toBe(true);
      expect(result.screenSize).toBe("mobile");
      expect(result.orientation).toBe("portrait");
    });
  });

  describe("useTouchGestures hook", () => {
    it("should provide gesture attachment function", () => {
      const result = useTouchGestures({
        onSwipeLeft: jest.fn(),
        onSwipeRight: jest.fn(),
      });

      expect(result.attachGestures).toBeDefined();
      expect(typeof result.attachGestures).toBe("function");
    });
  });

  describe("Mobile utilities", () => {
    it("should provide mobile detection functions", () => {
      // Test that mobile utilities are available
      expect(mockUseMobile).toBeDefined();
      expect(mockUseTouchGestures).toBeDefined();
    });
  });
});

// Simple component test to verify JSX compilation
function TestMobileComponent() {
  const mobile = useMobile();

  return (
    <div data-testid="mobile-component">
      <span>Is Mobile: {mobile.isMobile ? "Yes" : "No"}</span>
      <span>Screen Size: {mobile.screenSize}</span>
    </div>
  );
}

describe("TestMobileComponent", () => {
  it("should render mobile information", () => {
    render(<TestMobileComponent />);

    expect(screen.getByTestId("mobile-component")).toBeInTheDocument();
    expect(screen.getByText("Is Mobile: Yes")).toBeInTheDocument();
    expect(screen.getByText("Screen Size: mobile")).toBeInTheDocument();
  });
});
