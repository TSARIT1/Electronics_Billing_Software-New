import { useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import InvoicePreview from "../../components/invoice/InvoicePreview";
import BillingFormModal from "../../components/modals/BillingFormModal";
import { createInvoice } from "../../services/invoices";
import { listProducts } from "../../services/products";

const Billing = () => {
  const [search, setSearch] = useState("");
  const [billingFormOpen, setBillingFormOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [billingCart, setBillingCart] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: `GST/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    customer: "Walk-in Customer",
    phone: "",
    address: "",
    gstin: "",
    paymentMode: "Cash",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await listProducts();
        setProducts(data);
        const seeded = data.slice(0, 3).map((product) => ({
          productId: product.id,
          name: product.name,
          qty: 1,
          price: Number(product.price || 0),
          gst: 18,
        }));
        setBillingCart(seeded);
      } catch (error) {
        toast.error(error.message);
      }
    };

    loadProducts();
  }, []);

  const visibleCart = useMemo(() => {
    if (!search.trim()) {
      return billingCart;
    }
    const query = search.toLowerCase();
    return billingCart.filter((item) => item.name.toLowerCase().includes(query));
  }, [billingCart, search]);

  const handleCheckout = async () => {
    if (!billingCart.length) {
      toast.error("No items in cart to checkout.");
      return;
    }

    const invoiceItems = billingCart.map((it) => ({ productId: it.productId, quantity: it.qty }));
    try {
      const createdInvoice = await createInvoice({ items: invoiceItems });
      setInvoiceDetails((d) => ({
        ...d,
        invoiceNo: `INV-${createdInvoice.id}`,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      }));

      const newBill = {
        id: `INV-${createdInvoice.id}`,
        customer: invoiceDetails.customer || "Walk-in Customer",
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        items: invoiceItems.length,
        total: `₹${Number(createdInvoice.total || 0).toLocaleString("en-IN")}`,
        payment: invoiceDetails.paymentMode || "Cash",
        status: "Paid",
        invoiceNo: `INV-${createdInvoice.id}`,
        itemDetails: invoiceItems.map((it) => ({
          name: products.find((p) => p.id === it.productId)?.name || "Item",
          qty: it.quantity,
          price: products.find((p) => p.id === it.productId)?.price || 0,
        })),
      };
      const storedHistory = JSON.parse(localStorage.getItem("billHistory")) || [];
      localStorage.setItem("billHistory", JSON.stringify([newBill, ...storedHistory]));

      toast.success("Checkout completed and invoice saved.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClearCart = () => {
    setBillingCart([]);
    toast.success("Cart cleared.");
  };

  const handleSaveBill = async (values) => {
    // Build invoice items from current billing cart if present
    const invoiceItems = billingCart.length
      ? billingCart.map((it) => ({ productId: it.productId, quantity: it.qty }))
      : (() => {
          const matchedProduct = products.find(
            (product) =>
              product.name?.toLowerCase() === values.itemDescription?.toLowerCase() ||
              product.sku?.toLowerCase() === values.itemDescription?.toLowerCase()
          );
          const fallbackProduct = matchedProduct || products[0];
          if (!fallbackProduct) {
            toast.error("No products found. Please add inventory first.");
            return [];
          }
          const quantity = values.quantity ? Number(values.quantity) : 1;
          return [{ productId: fallbackProduct.id, quantity: quantity }];
        })();

    if (!invoiceItems || invoiceItems.length === 0) {
      return;
    }

    try {
      const createdInvoice = await createInvoice({ items: invoiceItems });

      // Update local cart and preview with created invoice
      const firstItemProduct = products.find((p) => p.id === invoiceItems[0].productId);
      if (firstItemProduct) {
        setBillingCart((prev) => [
          {
            productId: firstItemProduct.id,
            name: firstItemProduct.name,
            qty: invoiceItems[0].quantity,
            price: Number(firstItemProduct.price || 0),
            gst: 18,
          },
          ...prev,
        ]);
      }

      setInvoiceDetails((d) => ({
        ...d,
        invoiceNo: `INV-${createdInvoice.id}`,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        customer: values.purchaser || d.customer,
        phone: values.phone || values.mobile || d.phone,
        address: values.address || d.address,
        gstin: values.gstin || d.gstin,
      }));

      // persist history locally as well for quick access
      const newBill = {
        id: `INV-${createdInvoice.id}`,
        customer: values.purchaser || "Unknown",
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        items: invoiceItems.length,
        total: `₹${Number(createdInvoice.total || 0).toLocaleString("en-IN")}`,
        payment: values.paymentMode || "Cash",
        status: "Paid",
        invoiceNo: `INV-${createdInvoice.id}`,
        itemDetails: invoiceItems.map((it) => ({ name: products.find((p) => p.id === it.productId)?.name || "Item", qty: it.quantity, price: products.find((p) => p.id === it.productId)?.price || 0 })),
      };
      const storedHistory = JSON.parse(localStorage.getItem("billHistory")) || [];
      localStorage.setItem("billHistory", JSON.stringify([newBill, ...storedHistory]));

      toast.success("Invoice saved to backend");
    } catch (error) {
      toast.error(error.message);
      return;
    }
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
                {visibleCart.map((item) => (
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

      <InvoicePreview
        details={invoiceDetails}
        items={visibleCart}
        onCheckout={handleCheckout}
        onClearCart={handleClearCart}
      />
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
