import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Auvora",
  description: "Privacy Policy for Auvora decision intelligence platform.",
};

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-8">Privacy Policy</h1>
      
      <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
        <p>
          We collect basic account information necessary to provide our service, including your email address and authentication credentials. When you use Auvora, you also submit decision information, which may include business context, hypotheses, assumptions, and related data points necessary for analysis.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">2. How We Use Your Information</h2>
        <p>
          Your account information is used to authenticate you and manage your subscription. The decision information you submit is processed by our AI models to generate decision-support analysis, stress-tests, and risk maps. We do not use your proprietary business data to train foundational AI models.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">3. Third-Party Processing</h2>
        <p>
          <strong>AI Processing:</strong> We utilize advanced third-party AI providers (such as Google Gemini) to process the decision context you submit. This processing is transient and strictly used to generate your report.
        </p>
        <p>
          <strong>Payments:</strong> All payments and subscriptions are processed securely through Razorpay. We do not directly collect, store, or process your raw credit card numbers or financial data on our servers.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">4. Cookies and Sessions</h2>
        <p>
          We use standard session cookies (specifically through our authentication provider, Supabase) to maintain your logged-in state and ensure the security of your account. We do not use invasive third-party tracking or advertising cookies.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">5. Data Retention and Deletion</h2>
        <p>
          We retain your decision records and reports so you can revisit and track outcomes over time. You have the right to request the deletion of your account and all associated data at any time. Upon receiving a verified deletion request, we will permanently erase your profile and decision records from our active databases.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">6. Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, or delete the personal information we hold about you. To exercise these rights, please contact us using the information below.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or wish to request data deletion, please visit <Link href="/contact" className="text-amber-400 hover:underline">our Contact page</Link>.
        </p>
      </section>
    </>
  );
}
