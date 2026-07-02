import { Edit2, Trash2 } from "lucide-react";
import Button from "../ui/Button";

const SupplierTable = ({ data, onEdit, onDelete, onAddSupplier }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-t border-card-border/20">
        <p className="text-slate-400">
          No suppliers added yet. Click{" "}
          <button onClick={onAddSupplier} className="text-amber-500 font-semibold hover:underline">
            "New Supplier"
          </button>{" "}
          to add one.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-card-border/20 text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-wider bg-slate-900/30">
            <th className="p-4 rounded-tl-lg">SUPPLIER NAME</th>
            <th className="p-4">EMAIL</th>
            <th className="p-4">CONTACT</th>
            <th className="p-4 text-right rounded-tr-lg">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-card-border/10 text-sm">
          {data.map((row) => (
            <tr
              key={row.id}
              className="group hover:bg-slate-800/30 transition-colors"
            >
              <td className="p-4 font-medium text-text-main">{row.name}</td>
              <td className="p-4 text-slate-300">{row.email || "-"}</td>
              <td className="p-4 text-slate-300">{row.contact}</td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    onClick={() => onEdit(row)}
                    className="p-2 h-auto hover:bg-amber-500/10 hover:text-amber-500 text-slate-400"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onDelete(row.id)}
                    className="p-2 h-auto hover:bg-red-500/10 hover:text-red-500 text-slate-400"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;
