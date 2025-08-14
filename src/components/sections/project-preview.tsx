import { getProjects } from "@/lib/project-queries";
import { ProjectGrid } from "@/components/features/project-grid";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import {
  ScrollTriggered,
  ScrollStagger,
} from "@/components/animations/scroll-triggered";
import {
  ScrollRevealStagger,
  ScrollTextReveal,
} from "@/components/animations/scroll-reveal-system";

export async function ProjectPreview() {
  // Get featured projects
  const { projects } = await getProjects({
    filters: { featured: true },
    limit: 6,
    sort: { field: "createdAt", direction: "desc" },
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <ScrollRevealStagger
        animation="scale"
        config={{ stagger: 0.15, delay: 0.1, easing: "backOut" }}
        className="space-y-6 text-center"
      >
        <ScrollTextReveal
          text="FEATURED PROJECTS"
          className="font-mono text-4xl font-bold text-black uppercase md:text-6xl"
          stagger={0.03}
          animation="slideUp"
        />
        <Typography
          variant="body"
          className="text-brutalist-charcoal-200 mx-auto max-w-2xl"
        >
          Explore cutting-edge web applications built with modern technologies
          and brutalist design principles. Each project represents a digital
          transformation that exceeded client expectations.
        </Typography>

        {/* Stats */}
        <div className="flex items-center justify-center space-x-8 md:space-x-16">
          <div className="text-center">
            <Typography
              variant="h2"
              className="text-3xl font-bold text-black md:text-4xl"
            >
              50+
            </Typography>
            <Typography
              variant="caption"
              className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
            >
              Projects Delivered
            </Typography>
          </div>
          <div className="text-center">
            <Typography
              variant="h2"
              className="text-3xl font-bold text-black md:text-4xl"
            >
              25+
            </Typography>
            <Typography
              variant="caption"
              className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
            >
              Happy Clients
            </Typography>
          </div>
          <div className="text-center">
            <Typography
              variant="h2"
              className="text-3xl font-bold text-black md:text-4xl"
            >
              4.9
            </Typography>
            <Typography
              variant="caption"
              className="text-brutalist-charcoal-200 font-mono text-xs uppercase"
            >
              Average Rating
            </Typography>
          </div>
        </div>
      </ScrollRevealStagger>

      {/* Featured Projects Grid */}
      <ScrollStagger delay={0.2} staggerDelay={0.15}>
        <ProjectGrid
          projects={projects}
          showFilters={false}
          showSearch={false}
          showSort={false}
          viewMode="grid"
        />
      </ScrollStagger>

      {/* Call to Action */}
      <ScrollTriggered animation="scale" delay={0.4} className="text-center">
        <Button variant="accent" size="lg" asChild>
          <SmoothScrollLink href="/projects">
            VIEW ALL PROJECTS →
          </SmoothScrollLink>
        </Button>
      </ScrollTriggered>
    </div>
  );
}
