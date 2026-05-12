import Card from "../ui/Card";
import Button from "../ui/Button";

const InvoicePreview = ({ details, items }) => {
  const subTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstTotal = items.reduce(
    (sum, item) => sum + (item.price * item.qty * item.gst) / 100,
    0
  );
  const grandTotal = subTotal + gstTotal;

  return (
    <Card className="h-full p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-main">Tax Invoice</h3>
          <p className="text-xs text-text-muted">GST Invoice Preview</p>
        </div>
        <div className="rounded-xl border border-card-border px-3 py-2 text-xs text-text-muted">
          {details.invoiceNo}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-card-border bg-slate-50 p-4 text-xs text-text-muted">
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

      <div className="mt-4 max-h-52 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-start justify-between border-b border-card-border pb-3 text-sm"
          >
            <div>
              <p className="font-medium text-text-main">{item.name}</p>
              <p className="text-xs text-text-muted">
                {item.qty} x ₹{item.price.toLocaleString("en-IN")}
              </p>
            </div>
            <p className="font-semibold text-text-main">
              ₹{(item.qty * item.price).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-card-border pt-4 text-sm">
        <div className="flex items-center justify-between text-text-muted">
          <span>Sub Total</span>
          <span className="text-text-main">
            ₹{subTotal.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center justify-between text-text-muted">
          <span>GST</span>
          <span className="text-text-main">
            ₹{gstTotal.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Grand Total</span>
          <span>₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-card-border bg-slate-50 p-4 text-xs text-text-muted">
        <div className="flex items-center justify-between">
          <span>Payment Mode</span>
          <span className="text-text-main">{details.paymentMode}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span>QR Code</span>
          <div className="h-16 w-16 rounded-lg border border-card-border bg-white" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="ghost">Clear Cart</Button>
        <Button variant="success">Checkout</Button>
      </div>
    </Card>
  );
};

export default InvoicePreview;
