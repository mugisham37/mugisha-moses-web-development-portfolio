import {
  getAllServices,
  getServiceBySlug,
  getFeaturedServices,
  getPopularServices,
  formatPrice,
  formatPriceRange,
} from "@/lib/services-data";

describe("Services Data", () => {
  describe("getAllServices", () => {
    it("should return all active services", async () => {
      const services = await getAllServices();
      expect(services).toBeDefined();
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);

      // All services should be active
      services.forEach((service) => {
        expect(service.active).toBe(true);
      });
    });

    it("should return services sorted by order", async () => {
      const services = await getAllServices();
      for (let i = 1; i < services.length; i++) {
        expect(services[i].order).toBeGreaterThanOrEqual(services[i - 1].order);
      }
    });
  });

  describe("getServiceBySlug", () => {
    it("should return service by slug", async () => {
      const service = await getServiceBySlug("web-development");
      expect(service).toBeDefined();
      expect(service?.slug).toBe("web-development");
      expect(service?.name).toBe("Web Development");
    });

    it("should return null for non-existent slug", async () => {
      const service = await getServiceBySlug("non-existent-service");
      expect(service).toBeNull();
    });
  });

  describe("getFeaturedServices", () => {
    it("should return only featured services", async () => {
      const services = await getFeaturedServices();
      expect(services).toBeDefined();
      expect(Array.isArray(services)).toBe(true);

      services.forEach((service) => {
        expect(service.featured).toBe(true);
        expect(service.active).toBe(true);
      });
    });
  });

  describe("getPopularServices", () => {
    it("should return only popular services", async () => {
      const services = await getPopularServices();
      expect(services).toBeDefined();
      expect(Array.isArray(services)).toBe(true);

      services.forEach((service) => {
        expect(service.popular).toBe(true);
        expect(service.active).toBe(true);
      });
    });
  });

  describe("formatPrice", () => {
    it("should format hourly prices correctly", () => {
      expect(formatPrice(20000, "HOURLY")).toBe("$200/hr");
    });

    it("should format project prices correctly", () => {
      expect(formatPrice(500000, "PROJECT")).toBe("$5,000");
    });

    it("should format monthly prices correctly", () => {
      expect(formatPrice(200000, "MONTHLY")).toBe("$2,000/mo");
    });

    it("should format custom prices correctly", () => {
      expect(formatPrice(100000, "CUSTOM")).toBe("Custom Quote");
    });
  });

  describe("formatPriceRange", () => {
    it("should format price ranges correctly", () => {
      expect(formatPriceRange(500000, 1000000, "PROJECT")).toBe(
        "$5,000 - $10,000"
      );
    });

    it('should format single price as "From" price', () => {
      expect(formatPriceRange(500000, undefined, "PROJECT")).toBe(
        "From $5,000"
      );
    });

    it("should return contact message when no prices provided", () => {
      expect(formatPriceRange(undefined, undefined, "PROJECT")).toBe(
        "Contact for Quote"
      );
    });
  });
});
