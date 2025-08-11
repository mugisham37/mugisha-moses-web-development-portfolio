import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "503 - Service Unavailable",
  description: "The service is temporarily unavailable.",
};

export default function ServiceUnavailable() {
  return (
    <Container className="flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-2xl p-8 text-center">
        <div className="mb-8">
          <Typography variant="display" className="text-accent mb-4">
            503
          </Typography>
          <Typography variant="h1" className="mb-4">
            SERVICE UNAVAILABLE
          </Typography>
          <Typography
            variant="body"
            className="text-muted-foreground mx-auto mb-6 max-w-md"
          >
            The service is temporarily unavailable due to maintenance or high
            traffic. Please try again in a few minutes.
          </Typography>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              STATUS
            </Typography>
            <Typography variant="caption">Temporary maintenance</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              DURATION
            </Typography>
            <Typography variant="caption">Expected: 5-10 minutes</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h4" className="text-accent mb-2">
              UPDATES
            </Typography>
            <Typography variant="caption">Check back shortly</Typography>
          </Card>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={() => window.location.reload()} variant="primary">
            RETRY NOW
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">GO HOME</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/contact">CONTACT SUPPORT</Link>
          </Button>
        </div>

        <div className="border-border mt-8 border-t pt-8">
          <Typography variant="caption" className="text-muted-foreground">
            Error Code: 503 | Service Unavailable
          </Typography>
        </div>
      </Card>
    </Container>
  );
}
