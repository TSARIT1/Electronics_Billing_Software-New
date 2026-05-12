import { Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";

const getStatusVariant = (status) => {
  if (status === "In Stock") return "success";
  if (status === "Low") return "warning";
  if (status === "Critical") return "danger";
  return "neutral";
};

const InventoryTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px] text-sm">
      <thead className="text-left text-xs font-semibold text-text-muted">
        <tr>
          <th className="pb-3">Product Name</th>
          <th className="pb-3">SKU</th>
          <th className="pb-3">Category</th>
          <th className="pb-3">HSN Code</th>
          <th className="pb-3">Cost Price</th>
          <th className="pb-3">Sell Price</th>
          <th className="pb-3">Stock</th>
          <th className="pb-3">Status</th>
          <th className="pb-3">Actions</th>
        </tr>
      </thead>
      <tbody className="text-text-main">
        {data.map((row) => (
          <tr key={row.sku} className="border-t border-card-border">
            <td className="py-4 font-medium">{row.name}</td>
            <td className="py-4 text-text-muted">{row.sku}</td>
            <td className="py-4 text-text-muted">{row.category}</td>
            <td className="py-4 text-text-muted">{row.hsn}</td>
            <td className="py-4 text-text-muted">{row.cost}</td>
            <td className="py-4 text-text-muted">{row.price}</td>
            <td className="py-4 text-text-muted">{row.stock}</td>
            <td className="py-4">
              <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
            </td>
            <td className="py-4">
              <div className="flex items-center gap-2">
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

export default InventoryTable;
