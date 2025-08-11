import { PageHeader } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DemoPage() {
  return (
    <>
      <PageHeader
        title="Layout Demo"
        description="Demonstration of the brutalist layout and navigation system with all components working together."
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Demo", href: "/demo", isCurrentPage: true },
        ]}
      >
        <div className="flex gap-4">
          <Button variant="accent" size="lg">
            Primary Action
          </Button>
          <Button variant="secondary" size="lg">
            Secondary Action
          </Button>
        </div>
      </PageHeader>

      <Container>
        <div className="space-y-12 py-16">
          {/* Header Demo */}
          <section>
            <Typography
              variant="h2"
              weight="bold"
              transform="uppercase"
              className="mb-6 text-white"
            >
              Header Features
            </Typography>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Responsive Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="mb-4 text-white/80">
                    The header includes responsive navigation with desktop and
                    mobile menus, active link highlighting, and smooth
                    animations.
                  </Typography>
                  <ul className="space-y-2 font-mono text-sm text-white/70">
                    <li>• Scroll-based header behavior</li>
                    <li>• Mobile hamburger menu</li>
                    <li>• Keyboard navigation support</li>
                    <li>• Active link indicators</li>
                  </ul>
                </CardContent>
              </Card>

              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Accessibility Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="mb-4 text-white/80">
                    Built with accessibility in mind, including proper ARIA
                    labels, keyboard navigation, and screen reader support.
                  </Typography>
                  <ul className="space-y-2 font-mono text-sm text-white/70">
                    <li>• Skip navigation links</li>
                    <li>• ARIA labels and roles</li>
                    <li>• Focus management</li>
                    <li>• Screen reader friendly</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Breadcrumb Demo */}
          <section>
            <Typography
              variant="h2"
              weight="bold"
              transform="uppercase"
              className="mb-6 text-white"
            >
              Breadcrumb Navigation
            </Typography>
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Hierarchical Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body" className="mb-4 text-white/80">
                  The breadcrumb component automatically generates navigation
                  from the current path or accepts custom breadcrumb items. It
                  includes proper semantic markup and animations.
                </Typography>
                <Typography
                  variant="body"
                  className="font-mono text-sm text-white/60"
                >
                  Current breadcrumb: Home → Demo
                </Typography>
              </CardContent>
            </Card>
          </section>

          {/* Footer Demo */}
          <section>
            <Typography
              variant="h2"
              weight="bold"
              transform="uppercase"
              className="mb-6 text-white"
            >
              Footer Features
            </Typography>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Newsletter Signup</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="text-white/80">
                    Integrated newsletter subscription with form validation and
                    success states.
                  </Typography>
                </CardContent>
              </Card>

              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="text-white/80">
                    Social media links with proper external link attributes and
                    accessibility.
                  </Typography>
                </CardContent>
              </Card>

              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Quick Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="text-white/80">
                    Quick access to main site sections and legal pages.
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Scroll Progress Demo */}
          <section>
            <Typography
              variant="h2"
              weight="bold"
              transform="uppercase"
              className="mb-6 text-white"
            >
              Scroll Progress
            </Typography>
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Visual Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body" className="mb-4 text-white/80">
                  The scroll progress indicator at the top of the page shows
                  reading progress with smooth animations and brutalist yellow
                  accent color.
                </Typography>
                <Typography
                  variant="body"
                  className="font-mono text-sm text-white/60"
                >
                  Scroll down to see the progress indicator in action.
                </Typography>
              </CardContent>
            </Card>
          </section>

          {/* Spacer content to demonstrate scroll */}
          <div className="space-y-8">
            {Array.from({ length: 5 }, (_, i) => (
              <Card key={i} padding="lg" variant="elevated">
                <CardHeader>
                  <CardTitle>Demo Section {i + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="text-white/80">
                    This is additional content to demonstrate the scroll
                    progress indicator and header behavior. The header will
                    change appearance as you scroll, and the progress bar will
                    update to show your position on the page.
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
