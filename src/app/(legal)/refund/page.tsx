import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | Auvora",
  description: "Refund and cancellation policy for Auvora.",
};

export default function RefundPage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-8">Refund Policy</h1>

      <p className="text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">Subscription Cancellations</h2>
        <p>
          You may cancel your Auvora subscription at any time. When you cancel, your subscription will remain active until the end of your current billing cycle, after which it will not renew. You will retain access to your paid features for the duration of the paid period.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white">Refund Requests</h2>
        <p>
          Unless otherwise required by applicable law, all subscription charges are non-refundable. We do not provide refunds or credits for partially used billing periods or for unused AI analysis quotas.
        </p>
        <p>
          If you believe there has been a billing error or an unauthorized charge, please contact our support team immediately. Refund requests for billing errors are handled according to the applicable purchase terms on a case-by-case basis.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Contact for Billing Issues</h2>
        <p>
          If you experience any issues with your subscription, payments, or have a refund inquiry, please visit <Link href="/contact" className="text-amber-400 hover:underline">our Contact page</Link>.
        </p>
      </section>
    </>
  );
}
