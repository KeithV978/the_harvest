import { format } from "date-fns";
import { useState } from "react";
import { Eye } from "lucide-react";


const EvangelistTable = ({ evangelists }: { evangelists: any[] }) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block w-full overflow-x-auto">
      <table className="harvest-table min-w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Leads Added</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        {evangelists.map((user) => (
          <tr key={user.id}>
            <td>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-harvest-100 flex items-center justify-center text-harvest-700 font-bold text-sm">
                  {user.name[0]}
                </div>
                <span className="font-medium text-earth-900">{user.name}</span>
              </div>
            </td>
            <td className="text-earth-600">{user.email}</td>
            <td>
              <span className="badge bg-harvest-100 text-harvest-700">
                {user._count?.addedLeads ?? 0} leads
              </span>
            </td>
            <td className="text-earth-400 text-sm">
              {format(new Date(user.createdAt), "MMM d, yyyy")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
      </div>

      {/* Mobile/Tablet List View */}
      <div className="lg:hidden space-y-3">
        {evangelists.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-white border border-harvest-100 rounded-xl hover:border-harvest-300 hover:bg-harvest-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-harvest-100 flex items-center justify-center text-harvest-700 font-bold text-sm flex-shrink-0">
                  {user.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-earth-900 truncate">{user.name}</div>
                  <div className="text-xs text-earth-400 truncate">{user.email}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-earth-500">Leads Added</span>
                <span className="badge bg-harvest-100 text-harvest-700">
                  {user._count?.addedLeads ?? 0} leads
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-harvest-100">
                <span className="text-earth-500">Joined</span>
                <span className="text-earth-400 text-xs">{format(new Date(user.createdAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EvangelistTable;