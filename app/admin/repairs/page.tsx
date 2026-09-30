import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import AdminRepairsDashboard from "./repairs-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminRepairsPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminRepairsDashboard adminEmail={session.user.email} />;
}