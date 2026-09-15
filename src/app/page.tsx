import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="text-xl font-medium text-zinc-300 sm:text-2xl">
          {siteConfig.tagline}
        </p>
        <p className="text-base text-zinc-400">
          {siteConfig.description}
        </p>
      </div>
    </main>
  );
}

