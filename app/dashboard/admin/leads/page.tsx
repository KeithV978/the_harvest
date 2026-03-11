// app/dashboard/admin/leads/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import LeadTable from "@/components/leads/LeadTable";
import { LEAD_STATUS_LABELS, SOUL_STATE_LABELS } from "@/lib/utils";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [soulFilter, setSoulFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (statusFilter) params.set("status", statusFilter);
    if (soulFilter) params.set("soulState", soulFilter);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    const res = await fetch(`/api/leads?${params}`);
    const data = await res.json();
    setLeads(data.leads ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [page, statusFilter, soulFilter, dateFrom, dateTo]);

  const filtered = leads.filter(l =>
    l.fullName.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase()) ||
    l.addedBy?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / 15);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">All Leads</h1>
        <p className="page-subtitle">{total} total leads in the system</p>
      </div>

      <div className="harvest-card overflow-hidden">
        {/* Filters bar */}
        <div className="flex flex-col gap-3 px-4 sm:px-6 py-4 border-b border-harvest-100 bg-harvest-50/50">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="harvest-input pl-9 text-xs py-2 w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="harvest-select text-xs py-2 flex-1 sm:flex-none sm:w-36">
              <option value="">All Statuses</option>
              {Object.entries(LEAD_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>

            <select value={soulFilter} onChange={e => { setSoulFilter(e.target.value); setPage(1); }} className="harvest-select text-xs py-2 flex-1 sm:flex-none sm:w-44">
              <option value="">All Soul States</option>
              {Object.entries(SOUL_STATE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>

            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} className="harvest-input text-xs py-2 flex-1 sm:flex-none sm:w-36" placeholder="From" />
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} className="harvest-input text-xs py-2 flex-1 sm:flex-none sm:w-36" placeholder="To" />

            {(statusFilter || soulFilter || dateFrom || dateTo) && (
              <button onClick={() => { setStatusFilter(""); setSoulFilter(""); setDateFrom(""); setDateTo(""); setPage(1); }} className="harvest-btn-secondary text-xs py-2 flex-1 sm:flex-none">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-earth-400">Loading leads...</div>
        ) : (
          <LeadTable
            leads={filtered}
            showAddedBy={true}
            showAssignedTo={true}
            isAdmin={true}
            onLeadUpdated={updated => setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))}
            onLeadDeleted={id => { setLeads(prev => prev.filter(l => l.id !== id)); setTotal(t => t - 1); }}
          />
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 border-t border-harvest-100">
            <span className="text-xs sm:text-sm text-earth-500 order-2 sm:order-1">
              Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, total)} of {total}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 order-1 sm:order-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="harvest-btn-secondary text-xs disabled:opacity-40 w-full sm:w-auto">← Prev</button>
              <div className="flex gap-1 justify-center sm:justify-start overflow-x-auto">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex-shrink-0 rounded-lg text-xs font-medium transition-all ${p === page ? "bg-harvest-500 text-white" : "bg-harvest-50 text-earth-600 hover:bg-harvest-100"}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="harvest-btn-secondary text-xs disabled:opacity-40 w-full sm:w-auto">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
