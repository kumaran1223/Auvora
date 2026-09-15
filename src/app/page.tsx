import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ExampleReport } from "@/components/landing/example-report";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { WhyAuvora } from "@/components/landing/why-auvora";
import { TargetAudience } from "@/components/landing/target-audience";
import { PricingSection } from "@/components/landing/pricing-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Auvora — Think it through. Before reality does.",
  description:
    "Auvora is an AI decision-intelligence platform for founders and business owners that stress-tests business decisions by exposing hidden assumptions, evidence gaps, blind spots, risks, and second-order consequences.",
  openGraph: {
    title: "Auvora — Think it through. Before reality does.",
    description:
      "AI decision-intelligence platform for founders and business owners.",
    type: "website",
  },
};

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white">
      <Navbar isAuthenticated={isAuthenticated} />
      <Hero isAuthenticated={isAuthenticated} />
      <ProblemSection />
      <HowItWorks />
      <ExampleReport />
      <FeatureGrid />
      <WhyAuvora />
      <TargetAudience />
      <PricingSection isAuthenticated={isAuthenticated} />
      <FinalCta isAuthenticated={isAuthenticated} />
      <Footer />
    </main>
  );
}
