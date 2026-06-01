import Card from "../ui/Card";
import Button from "../ui/Button";

const InvoicePreview = ({ details, items, onCheckout, onClearCart }) => {
  const subTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstTotal = items.reduce(
    (sum, item) => sum + (item.price * item.qty * (item.gst || 0)) / 100,
    0
  );
  const grandTotal = subTotal + gstTotal;

  return (
    <Card className="h-full p-6">
      <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 700 }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-main">Tax Invoice</h3>
          <p className="text-xs text-text-muted">GST Invoice Preview</p>
        </div>
        <div className="rounded-xl border border-card-border px-3 py-2 text-xs text-text-muted">
          {details.invoiceNo}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-card-border bg-surface-alt p-4 text-xs text-text-muted dark:bg-surface">
        <div className="flex items-center justify-between">
          <span>Date</span>
          <span className="text-text-main">{details.date}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Customer</span>
          <span className="text-text-main">{details.customer}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Phone</span>
          <span className="text-text-main">{details.phone}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>GSTIN</span>
          <span className="text-text-main">{details.gstin}</span>
        </div>
      </div>

      <div className="mt-4 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
        <table className="w-full text-sm table-fixed">
          <thead className="text-left text-xs text-text-muted">
            <tr>
              <th className="pb-2">Item Description</th>
              <th className="pb-2 w-24 text-right">Qty</th>
              <th className="pb-2 w-28 text-right">Rate</th>
              <th className="pb-2 w-32 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name} className="border-b border-card-border">
                <td className="py-4 pr-4">
                  <div className="font-medium text-text-main">{item.name}</div>
                  {item.hsnCode ? (
                    <div className="text-xs text-text-muted">HSN: {item.hsnCode}</div>
                  ) : null}
                </td>
                <td className="py-4 text-right text-text-muted">{item.qty}</td>
                <td className="py-4 text-right text-text-muted">₹{Number(item.price).toLocaleString('en-IN')}</td>
                <td className="py-4 text-right font-semibold text-text-main">₹{(Number(item.qty) * Number(item.price)).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-3 border-t border-card-border pt-5 text-sm">
        <div className="flex items-center justify-between text-text-muted">
          <span>Sub Total</span>
          <span className="text-text-main">₹{subTotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between text-text-muted">
          <span>GST</span>
          <span className="text-text-main">₹{gstTotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold text-lg">
          <span>Grand Total</span>
          <span className="text-text-main text-2xl">₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-card-border bg-surface-alt p-4 text-xs text-text-muted dark:bg-surface">
        <div className="flex items-center justify-between">
          <span>Payment Mode</span>
          <span className="text-text-main">{details.paymentMode}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span>QR Code</span>
          <div className="h-16 w-16 rounded-lg border border-card-border bg-surface dark:bg-surface-alt" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="ghost" onClick={onClearCart} disabled={!onClearCart}>
          Clear Cart
        </Button>
        <Button variant="success" onClick={onCheckout} disabled={!onCheckout}>
          Checkout
        </Button>
      </div>
      </div>
    </Card>
  );
};

export default InvoicePreview;
