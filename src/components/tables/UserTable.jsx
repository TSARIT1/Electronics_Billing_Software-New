import { Trash2, UserCog } from "lucide-react";
import Badge from "../ui/Badge";

const getRoleVariant = (role) => {
  if (role === "ADMIN") return "success";
  if (role === "MANAGER") return "warning";
  if (role === "STAFF") return "primary";
  return "neutral";
};

const UserTable = ({ data, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[700px] text-sm">
      <thead className="text-left text-xs font-semibold text-text-muted">
        <tr>
          <th className="pb-3 text-center">Initial</th>
          <th className="pb-3">Full Name</th>
          <th className="pb-3">Email Address</th>
          <th className="pb-3">Phone</th>
          <th className="pb-3 text-center">Role</th>
          <th className="pb-3">Actions</th>
        </tr>
      </thead>
      <tbody className="text-text-main">
        {data.map((user) => (
          <tr key={user.id} className="border-t border-card-border transition-colors hover:bg-surface-alt dark:hover:bg-surface">
             <td className="py-4">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
                    {user.name.charAt(0).toUpperCase()}
                </div>
             </td>
            <td className="py-4 font-medium">{user.name}</td>
            <td className="py-4 text-text-muted">{user.email}</td>
            <td className="py-4 text-text-muted">{user.phone}</td>
            <td className="py-4 text-center">
              <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
            </td>
            <td className="py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-card-border bg-gradient-to-br from-surface to-surface-alt text-text-muted shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-card dark:bg-surface-alt"
                >
                  <UserCog size={14} />
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-card-border bg-gradient-to-br from-surface to-surface-alt text-text-muted shadow-sm transition hover:-translate-y-0.5 hover:border-danger/30 hover:text-danger hover:shadow-card dark:bg-surface-alt"
                  onClick={() => {
                    if (window.confirm(`Delete user ${user.name}? This cannot be undone.`)) {
                      onDelete(user.id);
                    }
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable;
