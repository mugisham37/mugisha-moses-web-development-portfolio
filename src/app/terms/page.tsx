import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Developer Portfolio",
  description:
    "Terms of service and usage guidelines for the developer portfolio.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-current text-current p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-lg">
          <p>
            These terms of service govern your use of our portfolio website and
            services.
          </p>
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be
            bound by the terms and provision of this agreement.
          </p>
          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily view the materials on this
            website for personal, non-commercial transitory viewing only.
          </p>
          <h2>Disclaimer</h2>
          <p>
            The materials on this website are provided on an &apos;as is&apos;
            basis. We make no warranties, expressed or implied, and hereby
            disclaim all other warranties.
          </p>
          <h2>Contact Information</h2>
          <p>
            If you have any questions about these terms, please contact us
            through our website.
          </p>
        </div>
      </div>
    </div>
  );
}
