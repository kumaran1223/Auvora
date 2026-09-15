import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDecisionById } from "@/lib/db/decisions";
import { EditDecisionForm } from "@/components/decisions/edit-decision-form";

interface EditDecisionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDecisionPage({ params }: EditDecisionPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const decision = await getDecisionById(id);

  if (!decision) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Edit decision</h1>
            <p className="text-xs text-zinc-400">Update parameters or description for this decision.</p>
          </div>
          <Link
            href={`/decisions/${decision.id}`}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Link>
        </div>

        <EditDecisionForm decision={decision} />
      </div>
    </main>
  );
}

