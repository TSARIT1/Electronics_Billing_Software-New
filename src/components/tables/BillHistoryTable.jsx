import { Eye, FileText, Printer } from "lucide-react";
import Badge from "../ui/Badge";

const statusVariant = (status) => {
  if (status === "Paid") return "success";
  if (status === "Pending") return "warning";
  return "neutral";
};

const BillHistoryTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px] text-sm">
      <thead className="text-left text-xs font-semibold text-text-muted">
        <tr>
          <th className="pb-3">Bill ID</th>
          <th className="pb-3">Customer</th>
          <th className="pb-3">Date</th>
          <th className="pb-3">Items</th>
          <th className="pb-3">Total</th>
          <th className="pb-3">Payment</th>
          <th className="pb-3">Status</th>
          <th className="pb-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="border-t border-card-border">
            <td className="py-4 font-medium text-text-main">{row.id}</td>
            <td className="py-4 text-text-muted">{row.customer}</td>
            <td className="py-4 text-text-muted">{row.date}</td>
            <td className="py-4 text-text-muted">{row.items}</td>
            <td className="py-4 text-text-main">{row.total}</td>
            <td className="py-4 text-text-muted">{row.payment}</td>
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
                  <Printer size={14} />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-card-border text-text-muted hover:text-primary"
                >
                  <FileText size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default BillHistoryTable;
