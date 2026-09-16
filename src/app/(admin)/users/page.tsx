import Link from "next/link";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams["search"] === "string" ? resolvedParams["search"] : "";
  const plan = typeof resolvedParams["plan"] === "string" ? resolvedParams["plan"] : "all";
  const pageStr = typeof resolvedParams["page"] === "string" ? resolvedParams["page"] : "1";
  const page = parseInt(pageStr, 10) || 1;
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const adminClient = getAdminSupabaseClient();
  if (!adminClient) {
    return (
      <div className="p-6 text-red-400">
        Could not load users. Admin client is unavailable.
      </div>
    );
  }

  // Execute aggregate queries and paginated list concurrently
  let listQuery = adminClient
    .from("profiles")
    .select("id, email, full_name, company_name, industry, company_size, plan, created_at", { count: "exact" });

  if (search) {
    listQuery = listQuery.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,company_name.ilike.%${search}%`);
  }

  if (plan !== "all") {
    listQuery = listQuery.eq("plan", plan);
  }

  listQuery = listQuery
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  const [
    totalUsersResult,
    freeUsersResult,
    proUsersResult,
    businessUsersResult,
    usersResult
  ] = await Promise.allSettled([
    adminClient.from("profiles").select("id", { count: "exact", head: true }),
    adminClient.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "free"),
    adminClient.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "pro"),
    adminClient.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "business"),
    listQuery
  ]);

  // Handle Metrics
  const totalUsers = totalUsersResult.status === "fulfilled" && !totalUsersResult.value.error ? totalUsersResult.value.count : "Unavailable";
  const freeUsers = freeUsersResult.status === "fulfilled" && !freeUsersResult.value.error ? freeUsersResult.value.count : "Unavailable";
  const proUsers = proUsersResult.status === "fulfilled" && !proUsersResult.value.error ? proUsersResult.value.count : "Unavailable";
  const businessUsers = businessUsersResult.status === "fulfilled" && !businessUsersResult.value.error ? businessUsersResult.value.count : "Unavailable";

  // Handle Users List
  const listFailed = usersResult.status === "rejected" || (usersResult.status === "fulfilled" && usersResult.value.error);
  const users = (usersResult.status === "fulfilled" && !usersResult.value.error && usersResult.value.data) ? usersResult.value.data : [];
  const totalMatching = (usersResult.status === "fulfilled" && !usersResult.value.error && usersResult.value.count) ? usersResult.value.count : 0;
  const hasMore = offset + pageSize < totalMatching;

  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (plan !== "all") params.set("plan", plan);
    if (targetPage > 1) params.set("page", targetPage.toString());
    const str = params.toString();
    return `/admin/users${str ? `?${str}` : ""}`;
  };

  const getPlanStyle = (p: string) => {
    switch (p?.toLowerCase()) {
      case "business":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "pro":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const getPlanName = (p: string) => {
    if (!p) return "Unknown";
    return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Users</h1>
        <p className="mt-2 text-sm text-zinc-400">
          View and filter Auvora accounts.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-400">Total Users</h3>
          <div className="mt-2 text-3xl font-bold text-white">{totalUsers}</div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-400">Free Users</h3>
          <div className="mt-2 text-3xl font-bold text-white">{freeUsers}</div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-400">Pro Users</h3>
          <div className="mt-2 text-3xl font-bold text-white">{proUsers}</div>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-5">
          <h3 className="text-sm font-medium text-zinc-400">Business Users</h3>
          <div className="mt-2 text-3xl font-bold text-white">{businessUsers}</div>
        </div>
      </div>

      {/* Controls */}
      <form method="GET" action="/admin/users" className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="search" className="sr-only">Search users</label>
          <input 
            id="search"
            name="search"
            type="text"
            defaultValue={search}
            placeholder="Search by name, email, or company..."
            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="plan" className="sr-only">Filter by plan</label>
          <select
            id="plan"
            name="plan"
            defaultValue={plan}
            className="w-full sm:w-auto rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="business">Business</option>
          </select>
        </div>
        <button type="submit" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
          Filter
        </button>
      </form>

      {/* Users Table */}
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="border-b border-zinc-800/60 bg-zinc-900/50 text-xs uppercase text-zinc-500">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Name</th>
                <th scope="col" className="px-6 py-4 font-medium">Email</th>
                <th scope="col" className="px-6 py-4 font-medium">Company</th>
                <th scope="col" className="px-6 py-4 font-medium">Industry</th>
                <th scope="col" className="px-6 py-4 font-medium">Size</th>
                <th scope="col" className="px-6 py-4 font-medium">Plan</th>
                <th scope="col" className="px-6 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {listFailed ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    Could not load users.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-200">
                      {user.full_name || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.company_name || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.industry || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.company_size || <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getPlanStyle(user.plan)}`}>
                        {getPlanName(user.plan)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString(undefined, {
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
        {!listFailed && users.length > 0 && (
          <div className="flex items-center justify-between border-t border-zinc-800/60 px-6 py-4 bg-zinc-900/30">
            <div className="text-sm text-zinc-400">
              Showing <span className="font-medium text-zinc-300">{totalMatching === 0 ? 0 : offset + 1}</span> to <span className="font-medium text-zinc-300">{Math.min(offset + pageSize, totalMatching)}</span> of <span className="font-medium text-zinc-300">{totalMatching}</span> users
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
