// components/leads/AddLeadModal.tsx
"use client";
import { useState } from "react";
import { X, AlertCircle, Plus } from "lucide-react";

const AGE_RANGES = [
  { value: "UNDER_18", label: "Under 18" },
  { value: "AGE_18_25", label: "18 – 25" },
  { value: "AGE_26_35", label: "26 – 35" },
  { value: "AGE_36_45", label: "36 – 45" },
  { value: "AGE_46_60", label: "46 – 60" },
  { value: "ABOVE_60", label: "Above 60" },
];

const GENDER = [
  { value: "MALE", label: "Male"},
  { value: "FEMALE", label: "Female"}
];

const SOUL_STATES = [
  { value: "NEW_CONVERT", label: "New Convert" },
  { value: "UNCHURCHED_BELIEVER", label: "Un-churched Believer" },
  { value: "HUNGRY_BELIEVER", label: "Hungry Believer" },
];

export default function AddLeadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (lead: any) => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    ageRange: "AGE_18_25",
    phone: "",
    address: "",
    gender: "",
    location: "",
    additionalNotes: "",
    soulState: "NEW_CONVERT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to add lead");
    } else {
      onSuccess(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-harvest-50">
          <h2 className="font-display font-bold text-slate-900 text-lg sm:text-xl">
            Add New Lead
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-harvest-500 text-white text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="col-span-2">
              <label className="harvest-label">Full Name *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
                placeholder="Enter full name"
                className="harvest-input"
              />
            </div>

            <div>
              <label className="harvest-label">Age Range *</label>
              <select
                value={form.ageRange}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ageRange: e.target.value }))
                }
                className="harvest-select"
              >
                {AGE_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="harvest-label">Gender *</label>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm((f) => ({ ...f, gender: e.target.value }))
                }
                className="harvest-select"
              >
                {GENDER.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="harvest-label">Soul State *</label>
              <select
                value={form.soulState}
                onChange={(e) =>
                  setForm((f) => ({ ...f, soulState: e.target.value }))
                }
                className="harvest-select"
              >
                {SOUL_STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="harvest-label">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+234..."
                className="harvest-input"
              />
            </div>

            <div>
              <label className="harvest-label">Location *</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
                placeholder="e.g. Tanke"
                className="harvest-input"
              />
            </div>

            <div className="col-span-2">
              <label className="harvest-label">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                placeholder="Street address (optional)"
                className="harvest-input"
              />
            </div>

            <div className="col-span-2">
              <label className="harvest-label">Notes From Evangelist</label>
              <textarea
                rows={3}
                value={form.additionalNotes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, additionalNotes: e.target.value }))
                }
                placeholder="Any additional context about this person?"
                className="harvest-input resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-red-700 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="harvest-btn-secondary flex-1 justify-center text-sm"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="harvest-btn-primary flex-1 justify-center disabled:opacity-60 gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              {loading ? "Adding..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
