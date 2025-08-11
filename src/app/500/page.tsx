import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "500 - Internal Server Error",
  description: "An internal server error occurred.",
};

export default function InternalServerError() {
  return (
    <Container className="flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-2xl p-8 text-center">
        <div className="mb-8">
          <Typography variant="display" className="text-accent mb-4">
            500
          </Typography>
          <Typography variant="h1" className="mb-4">
            INTERNAL SERVER ERROR
          </Typography>
          <Typography
            variant="body"
            className="text-muted-foreground mx-auto mb-6 max-w-md"
          >
            Something went wrong on our end. Our development team has been
            notified and is working to fix the issue.
          </Typography>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              STATUS
            </Typography>
            <Typography variant="caption">System monitoring active</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              SUPPORT
            </Typography>
            <Typography variant="caption">Team has been alerted</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              ETA
            </Typography>
            <Typography variant="caption">Resolution in progress</Typography>
          </Card>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild variant="primary">
            <Link href="/">GO HOME</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">REPORT ISSUE</Link>
          </Button>
          <Button onClick={() => window.location.reload()} variant="ghost">
            RETRY
          </Button>
        </div>

        <div className="border-border mt-8 border-t pt-8">
          <Typography variant="caption" className="text-muted-foreground">
            Error Code: 500 | Internal Server Error
          </Typography>
        </div>
      </Card>
    </Container>
  );
}
