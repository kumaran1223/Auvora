import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDecisionsPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const adminClient = getAdminSupabaseClient();
  if (!adminClient) {
    redirect("/");
  }

  const resolvedParams = await props.searchParams;
  const search = typeof resolvedParams?.["q"] === "string" ? resolvedParams["q"] : "";
  const statusParam = typeof resolvedParams?.["status"] === "string" ? resolvedParams["status"] : "all";
  
  const validStatuses = ["draft", "analyzing", "completed", "archived"];
  const status = validStatuses.includes(statusParam) ? statusParam : "all";

  const page = Math.max(1, Number(resolvedParams?.["page"]) || 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  let listFailed = false;
  let decisions: {
    id: string;
    user_id: string;
    title: string;
    status: string;
    industry: string | null;
    company_size: string | null;
    created_at: string;
    updated_at: string;
  }[] = [];
  let totalMatching = 0;

  // Metrics
  let totalDecisions = 0;
  let draftDecisions = 0;
  let analyzingDecisions = 0;
  let completedDecisions = 0;
  let archivedDecisions = 0;

  try {
    const metricPromises = [
      adminClient.from("decisions").select("id", { count: "exact", head: true }),
      adminClient.from("decisions").select("id", { count: "exact", head: true }).eq("status", "draft"),
      adminClient.from("decisions").select("id", { count: "exact", head: true }).eq("status", "analyzing"),
      adminClient.from("decisions").select("id", { count: "exact", head: true }).eq("status", "completed"),
      adminClient.from("decisions").select("id", { count: "exact", head: true }).eq("status", "archived"),
    ];

    let query = adminClient
      .from("decisions")
      .select("id, user_id, title, status, industry, company_size, created_at, updated_at", { count: "exact" });

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      // Find matching profiles first
      const { data: profiles } = await adminClient
        .from("profiles")
        .select("id")
        .or(`email.ilike.%${search}%,company_name.ilike.%${search}%`);

      if (profiles && profiles.length > 0) {
        const profileIds = profiles.map(p => p.id).join(',');
        query = query.or(`title.ilike.%${search}%,user_id.in.(${profileIds})`);
      } else {
        query = query.or(`title.ilike.%${search}%`);
      }
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    const [
      totalRes,
      draftRes,
      analyzingRes,
      completedRes,
      archivedRes,
      decisionsRes
    ] = await Promise.allSettled([
      metricPromises[0],
      metricPromises[1],
      metricPromises[2],
      metricPromises[3],
      metricPromises[4],
      query
    ]);

    if (totalRes.status === "fulfilled" && totalRes.value?.count != null) totalDecisions = totalRes.value.count;
    if (draftRes.status === "fulfilled" && draftRes.value?.count != null) draftDecisions = draftRes.value.count;
    if (analyzingRes.status === "fulfilled" && analyzingRes.value?.count != null) analyzingDecisions = analyzingRes.value.count;
    if (completedRes.status === "fulfilled" && completedRes.value?.count != null) completedDecisions = completedRes.value.count;
    if (archivedRes.status === "fulfilled" && archivedRes.value?.count != null) archivedDecisions = archivedRes.value.count;

    if (decisionsRes.status === "fulfilled") {
      if (decisionsRes.value?.error) {
        listFailed = true;
      } else {
        decisions = decisionsRes.value?.data || [];
        totalMatching = decisionsRes.value?.count || 0;
      }
    } else {
      listFailed = true;
    }
  } catch {
    listFailed = true;
  }

  // Resolve emails
  const emailMap = new Map<string, string>();
  if (!listFailed && decisions.length > 0) {
    try {
      const userIds = Array.from(new Set(decisions.map(d => d.user_id)));
      const { data: profiles } = await adminClient
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      if (profiles) {
        profiles.forEach(p => emailMap.set(p.id, p.email));
      }
    } catch {
      // Safe fallback, emails will just show as Unknown user
    }
  }

  const hasMore = offset + pageSize < totalMatching;

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (status !== "all") params.set("status", status);
    if (newPage > 1) params.set("page", newPage.toString());
    const queryStr = params.toString();
    return `/admin/decisions${queryStr ? `?${queryStr}` : ""}`;
  };

  const getStatusStyle = (s: string) => {
    switch (s) {
      case "draft":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      case "analyzing":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "archived":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const getStatusName = (s: string) => {
    if (!s) return "Unknown";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Decisions</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Operationally inspect decision volume and status.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-400">Total</h3>
          <div className="mt-2 text-3xl font-bold text-white">{totalDecisions}</div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-400">Draft</h3>
          <div className="mt-2 text-3xl font-bold text-white">{draftDecisions}</div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-amber-500">Analyzing</h3>
          <div className="mt-2 text-3xl font-bold text-amber-500">{analyzingDecisions}</div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-emerald-500">Completed</h3>
          <div className="mt-2 text-3xl font-bold text-emerald-500">{completedDecisions}</div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-500">Archived</h3>
          <div className="mt-2 text-3xl font-bold text-zinc-500">{archivedDecisions}</div>
        </div>
      </div>

      {/* Controls */}
      <form method="GET" action="/admin/decisions" className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="q" className="sr-only">Search decisions</label>
          <input 
            id="q"
            name="q"
            type="text"
            defaultValue={search}
            placeholder="Search by title, email, or company..."
            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="status" className="sr-only">Filter by status</label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="w-full sm:w-auto rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="analyzing">Analyzing</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button type="submit" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
          Filter
        </button>
      </form>

      {/* Decisions Table */}
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="border-b border-zinc-800/60 bg-zinc-900/50 text-xs uppercase text-zinc-500">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Decision</th>
                <th scope="col" className="px-6 py-4 font-medium">User</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium">Industry</th>
                <th scope="col" className="px-6 py-4 font-medium">Size</th>
                <th scope="col" className="px-6 py-4 font-medium">Created</th>
                <th scope="col" className="px-6 py-4 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {listFailed ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    Could not load decisions.
                  </td>
                </tr>
              ) : decisions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    {search || status !== "all" ? "No decisions match your current filters." : "No decisions yet."}
                  </td>
                </tr>
              ) : (
                decisions.map((decision) => (
                  <tr key={decision.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-200 font-medium">
                      {decision.title || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {emailMap.get(decision.user_id) || <span className="text-zinc-600">Unknown user</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getStatusStyle(decision.status)}`}>
                        {getStatusName(decision.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {decision.industry || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {decision.company_size || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(decision.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(decision.updated_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!listFailed && decisions.length > 0 && (
          <div className="flex items-center justify-between border-t border-zinc-800/60 px-6 py-4 bg-zinc-900/30">
            <div className="text-sm text-zinc-400">
              Showing <span className="font-medium text-zinc-300">{totalMatching === 0 ? 0 : offset + 1}</span> to <span className="font-medium text-zinc-300">{Math.min(offset + pageSize, totalMatching)}</span> of <span className="font-medium text-zinc-300">{totalMatching}</span> decisions
            </div>
            <div className="flex gap-2">
              {page > 1 ? (
                <Link href={buildPageUrl(page - 1)} className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 transition">
                  Previous
                </Link>
              ) : (
                <button disabled className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-600 cursor-not-allowed">
                  Previous
                </button>
              )}
              {hasMore ? (
                <Link href={buildPageUrl(page + 1)} className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 transition">
                  Next
                </Link>
              ) : (
                <button disabled className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-600 cursor-not-allowed">
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
