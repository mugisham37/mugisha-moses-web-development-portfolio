import SystemStatus from "@/components/test/SystemStatus";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-black font-space-mono">
          BRUTALIST PORTFOLIO
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Next.js 14 project initialized successfully with TypeScript and
          essential dependencies.
        </p>
        <SystemStatus className="mt-8" />
      </div>
    </main>
  );
}
