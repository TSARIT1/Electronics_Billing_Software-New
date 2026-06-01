import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";

const statusVariant = (status) => {
  if (status === "Delivered") return "success";
  if (status === "Processing") return "warning";
  if (status === "Pending") return "danger";
  return "neutral";
};

const PurchaseTable = ({ data, onView, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[800px] text-sm">
      <thead className="text-left text-xs font-semibold text-text-muted">
        <tr>
          <th className="pb-3">Order ID</th>
          <th className="pb-3">Supplier</th>
          <th className="pb-3">Date</th>
          <th className="pb-3">Items</th>
          <th className="pb-3">Amount</th>
          <th className="pb-3">Status</th>
          <th className="pb-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="border-t border-card-border transition-colors hover:bg-surface-alt dark:hover:bg-surface">
            <td className="py-4 font-medium text-text-main">{row.id}</td>
            <td className="py-4 text-text-muted">{row.supplier}</td>
            <td className="py-4 text-text-muted">{row.date}</td>
            <td className="py-4 text-text-muted">{row.itemsCount}</td>
            <td className="py-4 text-text-main">{row.amount}</td>
            <td className="py-4">
              <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
            </td>
            <td className="py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-card-border bg-gradient-to-br from-surface to-surface-alt text-text-muted shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-card dark:bg-surface-alt"
                  onClick={() => onView && onView(row)}
                >
                  <Eye size={14} />
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-card-border bg-gradient-to-br from-surface to-surface-alt text-text-muted shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-card dark:bg-surface-alt"
                  onClick={() => onEdit && onEdit(row)}
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-card-border bg-gradient-to-br from-surface to-surface-alt text-text-muted shadow-sm transition hover:-translate-y-0.5 hover:border-danger/30 hover:text-danger hover:shadow-card dark:bg-surface-alt"
                  onClick={() => {
                    if (!onDelete) return;
                    if (window.confirm(`Delete purchase order ${row.id}? This will reverse its stock changes.`)) {
                      onDelete(row);
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

export default PurchaseTable;
