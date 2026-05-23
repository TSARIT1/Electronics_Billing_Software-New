import { Eye, FileText, Printer } from "lucide-react";
import Badge from "../ui/Badge";
import { generateBillPDF } from "../../services/pdfGenerator";

const statusVariant = (status) => {
  if (status === "Paid") return "success";
  if (status === "Pending") return "warning";
  return "neutral";
};

const handlePrintBill = async (billData) => {
  const billForPDF = {
    id: billData.id,
    invoiceNo: billData.invoiceNo || billData.id,
    customer: billData.customer,
    date: billData.date,
    address: billData.address || "",
    phone: billData.phone || "",
    mobile: billData.mobile || "",
    gstin: billData.gstin || "",
    transporter: billData.transporter || "",
    vehicleNo: billData.vehicleNo || "",
    stateCode: billData.stateCode || "",
    spotDiscount: billData.spotDiscount || "",
    splSeaDiscount: billData.splSeaDiscount || "",
    otherDiscount: billData.otherDiscount || "",
    taxableAmount: billData.taxableAmount || 0,
    cgst: billData.cgst || 9,
    sgst: billData.sgst || 9,
    igst: billData.igst || 0,
    roundOff: billData.roundOff || 0,
    items: billData.itemDetails || [
      {
        name: billData.itemDescription || `Item (${billData.items} items)`,
        qty: billData.items || 1,
        units: billData.units || "Pcs",
        price: billData.rate || (billData.total ? Number(String(billData.total).replace(/[^0-9]/g, "")) / (billData.items || 1) : 0),
        hsnCode: billData.hsnCode || "8517",
      }
    ],
  };
  
  // attempt to use background stationery from public folder
  await generateBillPDF(billForPDF, '/stationery.jpg');
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
                  onClick={() => handlePrintBill(row)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-card-border text-text-muted hover:text-primary transition-colors"
                  title="Download PDF"
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
