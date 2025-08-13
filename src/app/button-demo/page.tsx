import { ButtonShowcase } from "@/components/ui/button-showcase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced Button System Demo | Portfolio",
  description:
    "Comprehensive showcase of the advanced button component system with sophisticated animations, multiple variants, and accessibility features.",
};

export default function ButtonDemoPage() {
  return (
    <main className="min-h-screen bg-black">
      <ButtonShowcase />
    </main>
  );
}
