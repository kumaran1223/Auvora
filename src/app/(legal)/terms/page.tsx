import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Auvora",
  description: "Terms of Service for Auvora decision intelligence platform.",
};

export default function TermsPage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-8">Terms of Service</h1>
      
      <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">1. Nature of the Service</h2>
        <p>
          Auvora is a software-as-a-service (SaaS) platform designed to provide decision-support, risk analysis, and stress-testing using artificial intelligence. The AI-generated analysis provided by Auvora is purely informational.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">2. No Guarantees or Professional Advice</h2>
        <p>
          We make no guarantees regarding the accuracy, completeness, or predictive success of the AI-generated reports. Auvora does not replace professional judgment, legal counsel, financial auditing, or fiduciary responsibility. You remain entirely responsible for your business choices and outcomes.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">3. Acceptable Use</h2>
        <p>
          You agree to use Auvora only for lawful purposes. You may not use the service to generate illegal content, harass others, reverse-engineer our systems, or attempt to circumvent our billing and quota limits.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">4. Subscriptions and Billing</h2>
        <p>
          Access to certain features requires a paid subscription. Subscriptions are billed on a recurring basis (e.g., monthly) according to the plan you select. By subscribing, you authorize our payment processor (Razorpay) to charge your payment method. You may cancel your subscription at any time; cancellation will take effect at the end of your current billing cycle.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">5. Termination and Suspension</h2>
        <p>
          We reserve the right to suspend or terminate your access to the service at our sole discretion, without notice, if we determine that you have violated these Terms of Service or engaged in abusive behavior.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Auvora and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of or reliance on the service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">7. Contact Information</h2>
        <p>
          If you have any questions regarding these Terms of Service, please contact us at: <a href="mailto:support@auvora.com" className="text-amber-400 hover:underline">support@auvora.com</a>.
        </p>
      </section>
    </>
  );
}

