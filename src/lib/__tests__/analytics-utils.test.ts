import {
  getDateRange,
  calculateTrend,
  formatDuration,
  formatNumber,
} from "../analytics-utils";

describe("Analytics Utils", () => {
  describe("getDateRange", () => {
    it("should return correct date range for 7d", () => {
      const { startDate, endDate } = getDateRange("7d");
      const daysDiff = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(daysDiff).toBe(7);
    });

    it("should return correct date range for 24h", () => {
      const { startDate, endDate } = getDateRange("24h");
      const hoursDiff = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
      );
      expect(hoursDiff).toBe(24);
    });

    it("should default to 7d for unknown range", () => {
      const { startDate, endDate } = getDateRange("unknown");
      const daysDiff = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(daysDiff).toBe(7);
    });
  });

  describe("calculateTrend", () => {
    it("should calculate positive trend correctly", () => {
      expect(calculateTrend(120, 100)).toBe(20);
    });

    it("should calculate negative trend correctly", () => {
      expect(calculateTrend(80, 100)).toBe(-20);
    });

    it("should handle zero previous value", () => {
      expect(calculateTrend(100, 0)).toBe(100);
      expect(calculateTrend(0, 0)).toBe(0);
    });
  });

  describe("formatDuration", () => {
    it("should format seconds correctly", () => {
      expect(formatDuration(45)).toBe("45s");
    });

    it("should format minutes and seconds correctly", () => {
      expect(formatDuration(125)).toBe("2:05");
      expect(formatDuration(60)).toBe("1:00");
    });
  });

  describe("formatNumber", () => {
    it("should format small numbers as-is", () => {
      expect(formatNumber(999)).toBe("999");
    });

    it("should format thousands with K", () => {
      expect(formatNumber(1500)).toBe("1.5K");
      expect(formatNumber(1000)).toBe("1.0K");
    });

    it("should format millions with M", () => {
      expect(formatNumber(1500000)).toBe("1.5M");
      expect(formatNumber(1000000)).toBe("1.0M");
    });
  });
});
