import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Offline - You're currently offline",
  description: "You're currently offline. Some features may be limited.",
};

export default function OfflinePage() {
  return (
    <Container className="flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-2xl p-8 text-center">
        <div className="mb-8">
          <div className="bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <svg
              className="text-muted-foreground h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2v6m0 8v6m-6-6h6m8 0h-6"
              />
            </svg>
          </div>

          <Typography variant="display" className="text-accent mb-4">
            OFFLINE
          </Typography>
          <Typography variant="h1" className="mb-4">
            YOU&apos;RE CURRENTLY OFFLINE
          </Typography>
          <Typography
            variant="body"
            className="text-muted-foreground mx-auto mb-6 max-w-md"
          >
            Your internet connection is unavailable. You can still browse cached
            content and use some features while offline.
          </Typography>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              CACHED PAGES
            </Typography>
            <Typography variant="caption">Previously visited pages</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              LOCAL DATA
            </Typography>
            <Typography variant="caption">
              Stored project information
            </Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              BASIC FEATURES
            </Typography>
            <Typography variant="caption">Navigation and browsing</Typography>
          </Card>
        </div>

        <div className="mb-8">
          <Typography variant="h3" className="mb-4">
            AVAILABLE OFFLINE
          </Typography>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Card className="hover:shadow-brutalist-yellow p-3 transition-all">
              <Typography variant="h4" className="mb-1">
                CACHED PROJECTS
              </Typography>
              <Typography variant="caption" className="text-muted-foreground">
                Browse previously loaded projects
              </Typography>
            </Card>
            <Card className="hover:shadow-brutalist-yellow p-3 transition-all">
              <Typography variant="h4" className="mb-1">
                BLOG POSTS
              </Typography>
              <Typography variant="caption" className="text-muted-foreground">
                Read cached blog content
              </Typography>
            </Card>
            <Card className="hover:shadow-brutalist-yellow p-3 transition-all">
              <Typography variant="h4" className="mb-1">
                PORTFOLIO INFO
              </Typography>
              <Typography variant="caption" className="text-muted-foreground">
                View basic portfolio information
              </Typography>
            </Card>
            <Card className="hover:shadow-brutalist-yellow p-3 transition-all">
              <Typography variant="h4" className="mb-1">
                CONTACT DETAILS
              </Typography>
              <Typography variant="caption" className="text-muted-foreground">
                Access contact information
              </Typography>
            </Card>
          </div>
        </div>

        <div className="mb-8">
          <Typography variant="h3" className="mb-4">
            LIMITED OFFLINE
          </Typography>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-400"></div>
              <Typography variant="caption" className="text-muted-foreground">
                Live GitHub data and statistics
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-400"></div>
              <Typography variant="caption" className="text-muted-foreground">
                Form submissions and contact forms
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-400"></div>
              <Typography variant="caption" className="text-muted-foreground">
                Real-time updates and notifications
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-400"></div>
              <Typography variant="caption" className="text-muted-foreground">
                External integrations and APIs
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={() => window.location.reload()} variant="primary">
            CHECK CONNECTION
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">BROWSE OFFLINE</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/projects">VIEW PROJECTS</Link>
          </Button>
        </div>

        <div className="border-border mt-8 border-t pt-8">
          <Typography variant="caption" className="text-muted-foreground">
            Connection Status: Offline | Service Worker Active
          </Typography>
        </div>
      </Card>
    </Container>
  );
}
