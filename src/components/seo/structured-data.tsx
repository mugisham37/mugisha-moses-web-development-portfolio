import Script from "next/script";

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

interface BreadcrumbsProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbsStructuredData({ items }: BreadcrumbsProps) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${item.url}`,
    })),
  };

  return <StructuredData data={breadcrumbData} />;
}
