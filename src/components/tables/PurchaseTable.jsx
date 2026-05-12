import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";

const statusVariant = (status) => {
  if (status === "Delivered") return "success";
  if (status === "Processing") return "warning";
  if (status === "Pending") return "danger";
  return "neutral";
};

const PurchaseTable = ({ data }) => (
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
          <tr key={row.id} className="border-t border-card-border">
            <td className="py-4 font-medium text-text-main">{row.id}</td>
            <td className="py-4 text-text-muted">{row.supplier}</td>
            <td className="py-4 text-text-muted">{row.date}</td>
            <td className="py-4 text-text-muted">{row.items}</td>
            <td className="py-4 text-text-main">{row.amount}</td>
            <td className="py-4">
              <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
            </td>
            <td className="py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-card-border text-text-muted hover:text-primary"
                >
                  <Eye size={14} />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-card-border text-text-muted hover:text-primary"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-card-border text-text-muted hover:text-danger"
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
