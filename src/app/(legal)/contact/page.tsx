import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Auvora",
  description: "Get in touch with the Auvora support team.",
};

export default function ContactPage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-8">Contact Us</h1>

      <p className="text-zinc-400 mb-8">
        We&apos;re here to help. Whether you have questions about our platform, need billing support, or want to request an account deletion, our team is ready to assist you.
      </p>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-2">Support Status</h2>
          <p className="text-zinc-300">
            Direct support contact is not currently available. Please check back soon for contact options.
          </p>
        </div>
      </div>
    </>
  );
}
