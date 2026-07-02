import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, ShoppingCart, Plus, Minus, X, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import InvoicePreview from "../../components/invoice/InvoicePreview";
import ProductCatalogModal from "../../components/modals/ProductCatalogModal";
import AddProductModal from "../../components/modals/AddProductModal";
import { createInvoice } from "../../services/invoices";
import { listProducts, createProduct } from "../../services/products";

const Billing = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [billingCart, setBillingCart] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  
  // Ref for the search container to handle clicks outside
  const searchContainerRef = useRef(null);

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: `GST/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    customer: "",
    phone: "",
    address: "",
    gstin: "",
    paymentMode: "Cash",
    stateCode: "",
    transporter: "",
    vehicleNo: "",
    mobile: "",
    spotDiscount: 0,
    splSeaDiscount: 0,
    otherDiscount: 0,
    cgst: 9,
    sgst: 9,
    igst: 0,
    roundOff: 0,
    grandTotal: 0,
    taxableAmount: 0,
  });

  const loadProducts = async () => {
    try {
      const data = await listProducts();
      setProducts(data);
      
      // Seed the cart with a few initial items for demonstration if we have items
      if (data && data.length > 0 && billingCart.length === 0) {
        const seededCart = data.slice(0, 2).map((product) => ({
          productId: product.id,
          name: product.name,
          hsnCode: product.hsn || "8517",
          qty: 1,
          price: Number(product.price || 0),
          gst: 18,
        }));
        setBillingCart(seededCart);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products based on search
  const filteredProducts = search.trim() === "" 
    ? [] 
    : products.filter((product) => 
        product.name?.toLowerCase().includes(search.toLowerCase()) || 
        product.sku?.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8); // limit to 8 results

  const addToCart = (product) => {
    setBillingCart((prev) => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        toast.success(`Increased ${product.name} quantity to ${existing.qty + 1}`);
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, qty: item.qty + 1 } 
            : item
        );
      }
      toast.success(`Added ${product.name} to cart`);
      return [...prev, {
        productId: product.id,
        name: product.name,
        hsnCode: product.hsn || "8517", // Default fallback if no hsn
        qty: 1,
        price: Number(product.price || 0),
        gst: 18,
      }];
    });
    setSearch("");
    setShowDropdown(false);
  };

  const updateQuantity = (productId, delta) => {
    setBillingCart((prev) => 
      prev.map(item => {
        if (item.productId === productId) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setBillingCart(prev => prev.filter(item => item.productId !== productId));
  };

  const handleCheckout = async (previewData = {}) => {
    if (!billingCart.length) {
      toast.error("No items in cart to checkout.");
      return;
    }

    const invoiceItems = billingCart.map((it) => ({ productId: it.productId, quantity: it.qty, price: it.price, name: it.name }));
    try {
      const createdInvoice = await createInvoice({
        items: invoiceItems,
        purchaser: previewData.customer || invoiceDetails.customer || "Walk-in Customer",
        phone: previewData.phone || invoiceDetails.phone,
        address: previewData.address || invoiceDetails.address,
        gstin: invoiceDetails.gstin,
        paymentMode: invoiceDetails.paymentMode || "Cash",
        invoiceNo: invoiceDetails.invoiceNo,
        date: invoiceDetails.date,
        transporter: previewData.transporter,
        vehicleNo: previewData.vehicleNo,
        mobile: previewData.phone,
        cgst: previewData.cgst,
        sgst: previewData.sgst,
        igst: previewData.igst,
        grandTotal: previewData.grandTotal,
        total: previewData.taxableAmount
      });

      const realInvoiceNo = `INV-${createdInvoice.id}`;
      
      const newBill = {
        id: realInvoiceNo,
        customer: previewData.customer || invoiceDetails.customer || "Walk-in Customer",
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        items: invoiceItems.length,
        total: `₹${Number(createdInvoice.grandTotal || previewData.grandTotal || 0).toLocaleString("en-IN")}`,
        payment: invoiceDetails.paymentMode || "Cash",
        status: "Paid",
        invoiceNo: realInvoiceNo,
        itemDetails: invoiceItems.map((it) => ({
          name: products.find((p) => p.id === it.productId)?.name || "Item",
          qty: it.quantity,
          price: products.find((p) => p.id === it.productId)?.price || 0,
        })),
        phone: invoiceDetails.phone,
        address: invoiceDetails.address,
        gstin: invoiceDetails.gstin,
      };
      

      toast.success("Checkout completed and saved!");
      handleClearCart();
      navigate('/bill-history');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClearCart = () => {
    setBillingCart([]);
    toast.success("Cart cleared.");
  };

  const handleSaveProduct = async (productData) => {
    try {
      const payload = {
        name: productData.name,
        brand: productData.brand,
        category: productData.category,
        sku: productData.sku,
        hsn: productData.hsn,
        costPrice: parseFloat(productData.cost),
        price: parseFloat(productData.price),
        quantity: parseInt(productData.stock),
        minStock: parseInt(productData.minStock || 5),
      };
      await createProduct(payload);
      toast.success("Product created successfully!");
      loadProducts();
    } catch (error) {
      toast.error(error.message || "Failed to create product");
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr] h-full">
        {/* Left Column */}
        <div className="flex flex-col gap-6 h-full">
          {/* Search Bar Card */}
          <Card className="p-4 flex items-center shrink-0 relative overflow-visible z-20 gap-3 bg-surface border-card-border/30">
            <div className="relative w-full" ref={searchContainerRef}>
              <SearchInput
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search product name, SKU, or scan barcode..."
                className="w-full text-lg py-3"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-alt px-2 py-1 rounded text-xs text-text-muted border border-card-border/20 font-bold">
                F2
              </div>

              {/* Autocomplete Dropdown */}
              {showDropdown && search.trim() !== "" && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-alt border border-card-border/30 rounded-xl shadow-2xl overflow-hidden z-50">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div 
                        key={product.id} 
                        onClick={() => addToCart(product)}
                        className="flex items-center justify-between p-3 hover:bg-[#1a2333] cursor-pointer border-b border-card-border/10 last:border-0 transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-text-main">{product.name}</div>
                          <div className="text-xs text-text-muted mt-0.5 flex gap-2">
                            <span>SKU: {product.sku || "N/A"}</span>
                            <span>•</span>
                            <span>Stock: {product.quantity}</span>
                          </div>
                        </div>
                        <div className="font-bold text-amber-500">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-text-muted text-sm flex flex-col items-center gap-2">
                      <p>No products found matching "{search}"</p>
                      <Button variant="outline" size="sm" onClick={() => {
                        setShowDropdown(false);
                        setAddProductOpen(true);
                      }}>
                        Add New Item
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Cart Items Card */}
          <Card className="flex flex-col flex-1 overflow-hidden p-0 border-card-border/20 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-card-border/20 bg-surface gap-3">
              <div>
                <h3 className="text-base font-semibold text-text-main flex items-center gap-2">
                  <ShoppingCart size={18} className="text-amber-500" />
                  Cart Items
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  {billingCart.length} items in cart
                </p>
              </div>
              <Button 
                onClick={() => setCatalogOpen(true)}
                variant="outline"
                className="flex items-center justify-center gap-2 text-amber-500 border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all rounded-xl px-5 h-10 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
              >
                <LayoutGrid size={18} />
                <span className="font-bold">Browse Catalog</span>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0a101f] custom-scrollbar">
              <table className="w-full text-sm">
                <thead className="text-left text-xs font-semibold text-text-muted sticky top-0 bg-surface border-b border-card-border/20 shadow-sm z-10">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 uppercase tracking-wider">Item Description</th>
                    <th className="py-3 px-4 uppercase tracking-wider text-center w-24">HSN Code</th>
                    <th className="py-3 px-4 uppercase tracking-wider text-center w-32">Qty</th>
                    <th className="py-3 px-4 uppercase tracking-wider text-right w-28">Rate (₹)</th>
                    <th className="py-3 px-4 uppercase tracking-wider text-right w-32">Gross Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {billingCart.length > 0 ? (
                    billingCart.map((item, index) => (
                      <tr key={`${item.productId}-${index}`} className="border-b border-card-border/10 hover:bg-surface-alt/50 transition-colors group">
                        <td className="py-3 px-4 text-center text-text-muted relative">
                          <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
                          <button 
                            onClick={() => removeFromCart(item.productId)}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </td>
                        <td className="py-3 px-4 font-medium text-text-main">{item.name}</td>
                        <td className="py-3 px-4 text-center text-text-muted">{item.hsnCode || "-"}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.productId, -1)}
                              className="w-6 h-6 rounded bg-surface border border-card-border/30 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center font-semibold">{item.qty}</span>
                            <button 
                              onClick={() => updateQuantity(item.productId, 1)}
                              className="w-6 h-6 rounded bg-surface border border-card-border/30 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-text-muted">{Number(item.price).toLocaleString("en-IN")}</td>
                        <td className="py-3 px-4 text-right font-semibold text-amber-500">
                          {(item.price * item.qty).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center text-text-muted opacity-50">
                          <ShoppingCart size={48} className="mb-4 text-amber-500/50" />
                          <p className="text-lg font-medium text-text-main mb-1">Cart is empty</p>
                          <p className="text-sm">Search or browse catalog to add products</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Invoice Preview */}
        <div className="h-full">
          <InvoicePreview 
            details={invoiceDetails} 
            items={billingCart} 
            onCheckout={handleCheckout} 
            onClearCart={handleClearCart} 
          />
        </div>
      </div>
      
      {/* Product Catalog Modal */}
      <ProductCatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        products={products}
        onAddToCart={addToCart}
        onAddNewProduct={() => setAddProductOpen(true)}
      />

      <AddProductModal
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Billing;
