import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <Container className="flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-2xl p-8 text-center">
        <div className="mb-8">
          <Typography variant="display" className="text-accent mb-4">
            404
          </Typography>
          <Typography variant="h1" className="mb-4">
            PAGE NOT FOUND
          </Typography>
          <Typography
            variant="body"
            className="text-muted-foreground mx-auto mb-6 max-w-md"
          >
            The page you're looking for has been moved, deleted, or never
            existed. Let's get you back on track.
          </Typography>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="hover:shadow-brutalist-yellow p-4 transition-all">
            <Typography variant="h4" className="mb-2">
              PROJECTS
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              Explore my latest work
            </Typography>
          </Card>
          <Card className="hover:shadow-brutalist-yellow p-4 transition-all">
            <Typography variant="h4" className="mb-2">
              BLOG
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              Read technical insights
            </Typography>
          </Card>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild variant="primary">
            <Link href="/">GO HOME</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/projects">VIEW PROJECTS</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/contact">CONTACT ME</Link>
          </Button>
        </div>

        <div className="border-border mt-8 border-t pt-8">
          <Typography variant="caption" className="text-muted-foreground">
            Error Code: 404 | Page Not Found
          </Typography>
        </div>
      </Card>
    </Container>
  );
}
