import { useState } from "react";
import { Printer } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import InvoicePreview from "../../components/invoice/InvoicePreview";
import { billingCart, invoiceDetails } from "../../data/mockData";

const Billing = () => {
  const [search, setSearch] = useState("");

  return (
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
    </div>
  );
};

export default Billing;
