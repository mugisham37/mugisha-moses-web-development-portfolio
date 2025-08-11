import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HeroSection } from "@/components/sections/hero-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Design System Showcase */}
      <Section padding="xl" background="muted">
        <Container>
          <div className="space-y-12">
            <Typography
              variant="h2"
              className="text-brutalist-yellow text-center"
            >
              DESIGN SYSTEM PREVIEW
            </Typography>

            {/* Typography Examples */}
            <div className="space-y-6">
              <Typography variant="h3">Typography Scale</Typography>
              <div className="space-y-4">
                <Typography variant="h1">
                  Heading 1 - BRUTALIST STYLE
                </Typography>
                <Typography variant="h2">
                  Heading 2 - INDUSTRIAL DESIGN
                </Typography>
                <Typography variant="h3">
                  Heading 3 - CONCRETE AESTHETICS
                </Typography>
                <Typography variant="body">
                  Body text uses Inter font for optimal readability while
                  maintaining the industrial aesthetic through careful spacing
                  and contrast.
                </Typography>
                <Typography variant="caption">
                  CAPTION TEXT - SPACE MONO UPPERCASE
                </Typography>
              </div>
            </div>

            {/* Button Examples */}
            <div className="space-y-6">
              <Typography variant="h3">Button Variants</Typography>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">PRIMARY</Button>
                <Button variant="secondary">SECONDARY</Button>
                <Button variant="accent">ACCENT</Button>
                <Button variant="ghost">GHOST</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">
                  SMALL
                </Button>
                <Button variant="primary" size="md">
                  MEDIUM
                </Button>
                <Button variant="primary" size="lg">
                  LARGE
                </Button>
                <Button variant="primary" size="xl">
                  EXTRA LARGE
                </Button>
              </div>
            </div>

            {/* Card Examples */}
            <div className="space-y-6">
              <Typography variant="h3">Card Components</Typography>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card variant="default" hover="lift">
                  <CardHeader>
                    <CardTitle>DEFAULT CARD</CardTitle>
                    <CardDescription>
                      Standard card with hover lift effect
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body">
                      This card demonstrates the default styling with brutalist
                      borders and hover animations.
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="elevated" hover="glow">
                  <CardHeader>
                    <CardTitle>ELEVATED CARD</CardTitle>
                    <CardDescription>
                      Elevated card with glow effect
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body">
                      This card uses the elevated variant with a subtle
                      background difference and glow hover effect.
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="accent" hover="invert">
                  <CardHeader>
                    <CardTitle>ACCENT CARD</CardTitle>
                    <CardDescription>
                      Yellow accent card with invert hover
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Typography variant="body">
                      This card showcases the accent color variant with color
                      inversion on hover.
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <Section padding="lg" background="default">
        <Container>
          <div className="text-center">
            <Typography
              variant="caption"
              className="text-brutalist-off-white-100"
            >
              BRUTALIST DEVELOPER PORTFOLIO - NEXT.JS 14 + TYPESCRIPT + TAILWIND
              CSS
            </Typography>
          </div>
        </Container>
      </Section>
    </main>
  );
}
