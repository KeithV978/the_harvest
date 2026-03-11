// app/dashboard/evangelist/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EvangelistDashboardClient from "./EvangelistDashboardClient";

export default async function EvangelistDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const user = session.user as any;
  if (user.role === "ADMIN") redirect("/dashboard/admin");
  if (user.role === "FOLLOWUP") redirect("/dashboard/followup");

  const leads = await prisma.lead.findMany({
    where: { addedById: user.id },
    include: {
      addedBy: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const stats = {
    total: leads.length,
    newLeads: leads.filter(l => l.status === "NEW_LEAD").length,
    followingUp: leads.filter(l => l.status === "FOLLOWING_UP").length,
    converted: leads.filter(l => l.status === "CONVERTED").length,
  };

  return <EvangelistDashboardClient leads={JSON.parse(JSON.stringify(leads))} stats={stats} userName={user.name} />;
}
