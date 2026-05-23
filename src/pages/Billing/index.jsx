import { useState } from "react";
import { Printer } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import InvoicePreview from "../../components/invoice/InvoicePreview";
import BillingFormModal from "../../components/modals/BillingFormModal";
import { billingCart, invoiceDetails } from "../../data/mockData";

const Billing = () => {
  const [search, setSearch] = useState("");
  const [billingFormOpen, setBillingFormOpen] = useState(false);

  const handleSaveBill = (values) => {
    const id = values.invoiceNo || `INV-${Date.now().toString().slice(-6)}`;
    const date = values.date
      ? new Date(values.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
    const quantity = values.quantity ? Number(values.quantity) : 1;
    const rate = values.rate ? Number(values.rate) : 0;
    const grossAmount = values.grossAmount ? Number(values.grossAmount) : rate * quantity;
    const netAmount = values.netAmount ? Number(values.netAmount) : grossAmount;
    const taxableAmount = values.taxableAmount ? Number(values.taxableAmount) : netAmount;
    const cgstPercent = values.cgst ? Number(values.cgst) : 9;
    const sgstPercent = values.sgst ? Number(values.sgst) : 9;
    const igstPercent = values.igst ? Number(values.igst) : 0;
    const roundOff = values.roundOff ? Number(values.roundOff) : 0;
    const cgstAmount = taxableAmount * (cgstPercent / 100);
    const sgstAmount = taxableAmount * (sgstPercent / 100);
    const igstAmount = taxableAmount * (igstPercent / 100);
    const computedGrandTotal = taxableAmount + cgstAmount + sgstAmount + igstAmount + roundOff;
    const totalValue = values.grandTotal || computedGrandTotal || 0;
    const formattedTotal = `₹${Number(totalValue).toLocaleString("en-IN")}`;

    const newBill = {
      id,
      customer: values.purchaser || "Unknown",
      date,
      items: quantity,
      total: formattedTotal,
      payment: "Cash",
      status: "Paid",
      invoiceNo: id,
      purchaser: values.purchaser || "Unknown",
      address: values.address || "",
      phone: values.phone || "",
      mobile: values.mobile || "",
      gstin: values.gstin || "",
      stateCode: values.stateCode || "",
      transporter: values.transporter || "",
      vehicleNo: values.vehicleNo || "",
      spotDiscount: values.spotDiscount || "",
      splSeaDiscount: values.splSeaDiscount || "",
      otherDiscount: values.otherDiscount || "",
      taxableAmount,
      cgst: cgstPercent,
      sgst: sgstPercent,
      igst: igstPercent,
      roundOff,
      grossAmount,
      netAmount,
      grandTotal: totalValue,
      itemDetails: [
        {
          name: values.itemDescription || "Item",
          qty: quantity,
          units: values.units || "Pcs",
          price: rate,
          hsnCode: values.hsnCode || "8517",
          grossAmount,
        },
      ],
    };

    const storedHistory =
      JSON.parse(localStorage.getItem("billHistory")) || [];
    localStorage.setItem(
      "billHistory",
      JSON.stringify([newBill, ...storedHistory])
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-main">Billing</h2>
          <p className="text-sm text-text-muted">
            Create and manage invoices based on bill details.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setBillingFormOpen(true)}
        >
          Add New Bill
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-text-main">
                  Billing Cart
                </h3>
                <p className="text-xs text-text-muted">
                  Scan items and manage quantities
                </p>
              </div>
              <Button variant="ghost">
                <Printer size={16} />
                Print Invoice
              </Button>
            </div>

          <div className="mt-4">
            <SearchInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product for billing"
            />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs font-semibold text-text-muted">
                <tr>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Qty</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {billingCart.map((item) => (
                  <tr key={item.name} className="border-t border-card-border">
                    <td className="py-4 font-medium text-text-main">
                      {item.name}
                    </td>
                    <td className="py-4 text-text-muted">{item.qty}</td>
                    <td className="py-4 text-text-muted">
                      ₹{item.price.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 font-semibold text-text-main">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-text-main">
                Cart Summary
              </h3>
              <p className="text-xs text-text-muted">
                GST inclusive totals
              </p>
            </div>
            <div className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
              3 Items
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-card-border bg-slate-50 p-6 text-center text-sm text-text-muted">
            Empty cart illustration
          </div>
        </Card>
      </div>

      <InvoicePreview details={invoiceDetails} items={billingCart} />
      <BillingFormModal
        isOpen={billingFormOpen}
        onClose={() => setBillingFormOpen(false)}
        onSave={handleSaveBill}
      />
    </div>
    </>
  );
};

export default Billing;
