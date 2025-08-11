import {
  generateMetadata,
  generateBreadcrumbJsonLd,
  generatePersonJsonLd,
} from "../seo";

describe("SEO utilities", () => {
  describe("generateMetadata", () => {
    it("should generate basic metadata", () => {
      const metadata = generateMetadata({
        title: "Test Page",
        description: "Test description",
      });

      expect(metadata.title).toBe("Test Page | Brutalist Developer Portfolio");
      expect(metadata.description).toBe("Test description");
      expect(metadata.openGraph?.title).toBe(
        "Test Page | Brutalist Developer Portfolio"
      );
      expect(metadata.twitter?.title).toBe(
        "Test Page | Brutalist Developer Portfolio"
      );
    });

    it("should generate article metadata", () => {
      const metadata = generateMetadata({
        title: "Blog Post",
        description: "Blog description",
        type: "article",
        publishedTime: "2024-01-01T00:00:00Z",
        tags: ["react", "nextjs"],
      });

      expect(metadata.openGraph?.type).toBe("article");
      expect(metadata.openGraph?.publishedTime).toBe("2024-01-01T00:00:00Z");
    });

    it("should handle noIndex flag", () => {
      const metadata = generateMetadata({
        title: "Private Page",
        noIndex: true,
      });

      expect(metadata.robots).toBe("noindex, nofollow");
    });
  });

  describe("generateBreadcrumbJsonLd", () => {
    it("should generate breadcrumb structured data", () => {
      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Projects", url: "/projects" },
        { name: "Project Name", url: "/projects/project-name" },
      ];

      const jsonLd = generateBreadcrumbJsonLd(breadcrumbs);

      expect(jsonLd["@context"]).toBe("https://schema.org");
      expect(jsonLd["@type"]).toBe("BreadcrumbList");
      expect(jsonLd.itemListElement).toHaveLength(3);
      expect(jsonLd.itemListElement[0].position).toBe(1);
      expect(jsonLd.itemListElement[0].name).toBe("Home");
    });
  });

  describe("generatePersonJsonLd", () => {
    it("should generate person structured data", () => {
      const jsonLd = generatePersonJsonLd();

      expect(jsonLd["@context"]).toBe("https://schema.org");
      expect(jsonLd["@type"]).toBe("Person");
      expect(jsonLd.jobTitle).toBe("Full-Stack Developer");
      expect(jsonLd.knowsAbout).toContain("JavaScript");
      expect(jsonLd.knowsAbout).toContain("React");
    });
  });
});
