import { format } from "date-fns"; 


const FollowupTable = ({ followups }: { followups: any[] }) => {
    return (
      <>
        {/* Desktop Table View */}
        <div className="hidden lg:block w-full overflow-x-auto">
            <table className="harvest-table min-w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Assigned Leads</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {followups.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {user.name[0]}
                      </div>
                      <span className="font-medium text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="text-slate-600">{user.email}</td>
                  <td>
                    <span className="badge bg-blue-100 text-blue-700">
                      {user._count?.assignedLeads ?? 0} leads
                    </span>
                  </td>
                  <td className="text-slate-400 text-sm">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
                </tr>
              ))}
            </tbody>
            </table>
        </div>

        {/* Mobile/Tablet List View */}
        <div className="lg:hidden space-y-3">
          {followups.map((user) => (
            <div
              key={user.id}
              className="p-4 bg-white border border-blue-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{user.name}</div>
                    <div className="text-xs text-slate-400 truncate">{user.email}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Leads</span>
                  <span className="badge bg-blue-100 text-blue-700">
                    {user._count?.assignedLeads ?? 0} leads
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-100">
                  <span className="text-slate-500">Joined</span>
                  <span className="text-slate-400 text-xs">{format(new Date(user.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
}

export default FollowupTable;