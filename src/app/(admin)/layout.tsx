import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = await isAdmin();

  if (!isAuthorized) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <AdminShell email={data?.user?.email}>
      {children}
    </AdminShell>
  );
}

