import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Developer Portfolio",
  description:
    "Privacy policy and data handling practices for the developer portfolio.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-current text-current p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg">
          <p>
            This privacy policy outlines how we collect, use, and protect your
            personal information when you visit our portfolio website.
          </p>
          <h2>Information We Collect</h2>
          <p>
            We may collect information you provide directly to us, such as when
            you contact us through our contact forms or subscribe to our
            newsletter.
          </p>
          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to respond to your inquiries,
            provide services, and improve our website experience.
          </p>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact
            us through our website contact form.
          </p>
        </div>
      </div>
    </div>
  );
}
