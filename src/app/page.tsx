import SystemStatus from "@/components/test/SystemStatus";
import { ThemeTest } from "@/components/test/ThemeTest";

export default function Home() {
  return (
    <main className="min-h-screen theme-bg theme-text">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold theme-text theme-font-primary">
          BRUTALIST PORTFOLIO
        </h1>
        <p className="mt-4 text-lg theme-text">
          Next.js 14 project with dual-theme brutalist architecture.
        </p>
        <SystemStatus className="mt-8" />
        <div className="mt-8">
          <ThemeTest />
        </div>
      </div>
    </main>
  );
}
