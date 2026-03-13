// app/dashboard/followup/page.tsx
"use client";
import { useState, useEffect } from "react";
import { FileText, Activity, CheckCircle, Clock, Flame } from "lucide-react";
import LeadTable from "@/components/leads/LeadTable";
import { useSession } from "next-auth/react";

export default function FollowupDashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const limit = 15;

  const fetchLeads = async () => {
    setLoading(true);
    const res = await fetch(`/api/leads?page=${page}&limit=${limit}`);
    const data = await res.json();
    setLeads(data.leads ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [page]);

  const stats = {
    total: total,
    followingUp: leads.filter(l => l.status === "FOLLOWING_UP").length,
    converted: leads.filter(l => l.status === "CONVERTED").length,
    hot: leads.filter(l => (l.monthsConsistent ?? 0) >= 3).length,
  };

  const totalPages = Math.ceil(total / limit);

  const statCards = [
    { label: "Assigned Leads", icon: FileText, value: stats.total, color: "bg-harvest-50 text-harvest-600", border: "border-harvest-200" },
    { label: "Following Up", icon: Activity, value: stats.followingUp, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
    { label: "Converted", icon: CheckCircle, value: stats.converted, color: "bg-green-50 text-green-600", border: "border-green-200" },
    { label: "Hot Leads", icon: Flame, value: stats.hot, color: "bg-red-50 text-red-600", border: "border-red-200" },
  ];

  return (
    <div className="mt-12">
      <div className="page-header">
        <h1 className="page-title">Follow-Up Dashboard</h1>
        <p className="page-subtitle">Leads assigned to  <strong>{session?.user?.name}</strong> by the admin</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className={`harvest-card p-5 border ${card.border}`}>
            <div className={`inline-flex p-2 rounded-xl ${card.color} mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-display text-earth-900">{card.value}</div>
            <div className="text-sm text-earth-500 mt-0.5"> 
              {card.label}</div>
          </div>
        ))}
      </div>

      <div className="harvest-card overflow-hidden">
        <div className="px-6 py-4 border-b border-harvest-100">
          <h2 className="font-display font-semibold text-earth-900">My Assigned Leads</h2>
        </div>
        {loading ? (
          <div className="py-16 text-center text-earth-400">Loading...</div>
        ) : (
          <LeadTable
            leads={leads}
            showAssignedTo={false}
            showAddedBy={true}
            onLeadUpdated={updated => setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))}
          />
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 border-t border-harvest-100">
            <span className="text-sm text-earth-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="harvest-btn-secondary text-xs disabled:opacity-40">← Prev</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="harvest-btn-secondary text-xs disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
