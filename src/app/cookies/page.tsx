import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Developer Portfolio",
  description:
    "Cookie policy and usage information for the developer portfolio.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-current text-current p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose prose-lg">
          <p>
            This cookie policy explains how we use cookies and similar
            technologies on our website.
          </p>
          <h2>What Are Cookies</h2>
          <p>
            Cookies are small text files that are stored on your computer or
            mobile device when you visit a website. They help us provide you
            with a better experience.
          </p>
          <h2>How We Use Cookies</h2>
          <p>
            We use cookies to remember your preferences, analyze website
            traffic, and improve our services. We may use both session and
            persistent cookies.
          </p>
          <h2>Managing Cookies</h2>
          <p>
            You can control and manage cookies in various ways. Most browsers
            allow you to refuse cookies or delete cookies that have already been
            set.
          </p>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact
            us.
          </p>
        </div>
      </div>
    </div>
  );
}
