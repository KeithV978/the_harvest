// app/dashboard/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import { Users, FileText, UserCheck, TrendingUp, Flame, Snowflake, Thermometer } from "lucide-react";
import { LEAD_STATUS_LABELS, SOUL_STATE_LABELS, CHURCH_LABELS, LEAD_STATUS_COLORS, SOUL_STATE_COLORS } from "@/lib/utils";

const ATTENDANCE_COLORS = { cold: "#93c5fd", lukewarm: "#fcd34d", hot: "#f87171" };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    const res = await fetch(`/api/admin/stats?${params}`);
    const data = await res.json();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats();
  };

  const handleClear = () => {
    setDateFrom("");
    setDateTo("");
    setTimeout(fetchStats, 50);
  };

  const statusData = stats?.statusCounts?.map((s: any) => ({
    name: LEAD_STATUS_LABELS[s.status as keyof typeof LEAD_STATUS_LABELS] ?? s.status,
    value: s._count,
    color: LEAD_STATUS_COLORS[s.status as keyof typeof LEAD_STATUS_COLORS] ?? "#aaa",
  })) ?? [];

  const soulData = stats?.soulStateCounts?.map((s: any) => ({
    name: SOUL_STATE_LABELS[s.soulState as keyof typeof SOUL_STATE_LABELS] ?? s.soulState,
    value: s._count,
    color: SOUL_STATE_COLORS[s.soulState as keyof typeof SOUL_STATE_COLORS] ?? "#aaa",
  })) ?? [];

  const churchData = stats?.churchCounts?.map((c: any) => ({
    name: c.churchMembership ? (CHURCH_LABELS[c.churchMembership as keyof typeof CHURCH_LABELS] ?? c.churchMembership) : "None",
    value: c._count,
  })) ?? [];

  const attendanceData = stats ? [
    { name: "Cold", icon: Snowflake, value: stats.attendance?.cold ?? 0, fill: ATTENDANCE_COLORS.cold },
    { name: "Lukewarm", icon: Thermometer, value: stats.attendance?.lukewarm ?? 0, fill: ATTENDANCE_COLORS.lukewarm },
    { name: "Hot ", icon: Flame , value: stats.attendance?.hot ?? 0, fill: ATTENDANCE_COLORS.hot },
  ] : [];

  return (
    <div>
      <div className="pt-6 page-header flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Overview of the harvest field</p>
        </div>

        {/* Date filter */}
        <form onSubmit={handleFilter} className="flex flex-col sm:flex-row sm:items-end gap-2 w-full sm:w-auto">
          <div>
            <label className="text-xs text-earth-500 block mb-1">From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="harvest-input text-xs py-2 w-full sm:w-36" />
          </div>
          <div>
            <label className="text-xs text-earth-500 block mb-1">To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="harvest-input text-xs py-2 w-full sm:w-36" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button type="submit" className="harvest-btn-primary text-xs py-2 flex-1 sm:flex-none">Filter</button>
            {(dateFrom || dateTo) && (
              <button type="button" onClick={handleClear} className="harvest-btn-secondary text-xs py-2 flex-1 sm:flex-none">Clear</button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="py-20 text-center text-earth-400">Loading stats...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Total Leads", icon: FileText, value: stats?.totalLeads ?? 0, bg: "bg-harvest-50", text: "text-harvest-600", border: "border-harvest-200" },
              { label: "Evangelists", icon: Users, value: stats?.evangelists ?? 0, bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
              { label: "Follow-Up", icon: UserCheck, value: stats?.followups ?? 0, bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
              { label: "Cold Leads", icon: Snowflake, value: stats?.attendance?.cold ?? 0, bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" },
              { label: "Lukewarm", icon: Thermometer, value: stats?.attendance?.lukewarm ?? 0, bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
              { label: "Hot Leads", icon: Flame, value: stats?.attendance?.hot ?? 0, bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
            ].map(card => (
              <div key={card.label} className={`harvest-card p-4 border ${card.border}`}>
                <div className={`inline-flex p-2 rounded-xl ${card.bg} ${card.text} mb-2`}>
                  <card.icon className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold font-display text-earth-900">{card.value}</div>
                <div className="text-xs text-earth-500 mt-0.5">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Lead Status */}
            <div className="harvest-card p-6">
              <h3 className="font-display font-semibold text-earth-900 mb-4">Lead Status Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {statusData.map((entry: any, i: number) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [v, "Leads"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Soul State */}
            <div className="harvest-card p-6">
              <h3 className="font-display font-semibold text-earth-900 mb-4">Soul State Overview</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={soulData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {soulData.map((entry: any, i: number) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [v, "Leads"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance */}
            <div className="harvest-card p-6">
              <h3 className="font-display font-semibold text-earth-900 mb-4">Church Attendance Status</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={attendanceData} barSize={40}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Leads" radius={[6,6,0,0]}>
                    {attendanceData.map((entry: any, i: number) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Church Membership */}
            <div className="harvest-card p-6">
              <h3 className="font-display font-semibold text-earth-900 mb-4">Church Membership Summary</h3>
              {churchData.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-earth-400 text-sm">No church data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={churchData} barSize={40}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" name="Members" fill="#f97316" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
