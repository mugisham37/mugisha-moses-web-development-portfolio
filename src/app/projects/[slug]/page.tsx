import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getRelatedProjects,
  incrementProjectViews,
} from "@/lib/project-queries";
import { ProjectDetail } from "@/components/features/project-detail";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  };
}

async function ProjectPageContent({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  // Get related projects
  const categoryIds = project.categories.map((cat) => cat.id);
  const relatedProjects = await getRelatedProjects(
    project.id,
    project.technologies,
    categoryIds,
    4
  );

  // Server action to increment view count
  async function handleViewIncrement() {
    "use server";
    await incrementProjectViews(project.id, {
      userAgent: "server-side",
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <Container>
      <Section className="space-y-8">
        {/* Back button */}
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              BACK TO PROJECTS
            </Link>
          </Button>
        </div>

        {/* Project detail */}
        <ProjectDetail
          project={project}
          relatedProjects={relatedProjects}
          onViewIncrement={handleViewIncrement}
        />
      </Section>
    </Container>
  );
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <main className="min-h-screen bg-black pt-20">
      <ProjectPageContent params={params} />
    </main>
  );
}
