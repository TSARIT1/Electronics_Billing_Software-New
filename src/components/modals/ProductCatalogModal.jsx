import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo } from "react";
import { X, ShoppingBag, Plus, Search, Tag } from "lucide-react";
import Button from "../ui/Button";

const ProductCatalogModal = ({ isOpen, onClose, products = [], onAddToCart, onAddNewProduct }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category || "Uncategorized"));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || (p.category || "Uncategorized") === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center glass-overlay p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden rounded-[2rem] border border-card-border bg-surface shadow-2xl relative"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-card-border/50 bg-gradient-to-r from-amber-500/10 via-surface to-surface-alt gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-main">Browse Catalog</h3>
                  <p className="text-sm text-text-muted">Select items to instantly add them to your cart</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Add Product Button */}
                <Button 
                  onClick={onAddNewProduct}
                  variant="outline" 
                  className="hidden md:flex items-center gap-2 text-amber-500 border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all rounded-xl h-[42px]"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span className="font-bold">Add Product</span>
                </Button>

                {/* Search Bar */}
                <div className="relative w-48 md:w-64 lg:w-80">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-amber-500/20 bg-slate-900/60 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors bg-surface-alt border border-card-border/30 shrink-0 ml-1"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Categories */}
              <div className="w-48 lg:w-64 border-r border-card-border/30 bg-surface-alt/30 p-4 overflow-y-auto hidden md:block custom-scrollbar">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 px-2">Categories</h4>
                <div className="flex flex-col gap-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${
                        activeCategory === cat 
                          ? "bg-amber-500 text-black shadow-md shadow-amber-500/20" 
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      }`}
                    >
                      <Tag size={16} />
                      <span className="truncate">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a101f] custom-scrollbar">
                
                {/* Mobile Categories (Scrollable row) */}
                <div className="flex md:hidden overflow-x-auto gap-2 pb-4 mb-4 border-b border-card-border/20 hide-scrollbar items-center">
                  <Button 
                    onClick={onAddNewProduct}
                    variant="outline" 
                    className="shrink-0 flex items-center gap-1.5 text-amber-500 border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all rounded-full h-8 px-3 text-xs"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    <span className="font-bold">Add</span>
                  </Button>
                  <div className="w-[1px] h-6 bg-card-border/40 mx-1"></div>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        activeCategory === cat 
                          ? "bg-amber-500 text-black" 
                          : "bg-surface border border-card-border text-slate-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="group flex flex-col rounded-2xl border border-card-border/40 bg-surface p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]"
                      >
                        <div className="relative mb-3 flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-surface-alt to-slate-900 border border-card-border/20 text-slate-600 transition-colors group-hover:from-amber-500/10 group-hover:to-amber-500/5 group-hover:text-amber-500/50">
                          {/* Stock Badge */}
                          <div className="absolute top-2 right-2 rounded bg-black/40 px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-white/5 backdrop-blur-md">
                            Qty: {product.quantity || 0}
                          </div>
                          <ShoppingBag size={48} strokeWidth={1} />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <h4 className="font-semibold text-text-main line-clamp-2 leading-snug mb-1 group-hover:text-amber-500 transition-colors" title={product.name}>
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 mb-2 font-mono truncate mt-auto">
                            SKU: {product.sku || "N/A"}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-card-border/30">
                          <div className="font-black text-lg text-white">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </div>
                          <button 
                            onClick={() => onAddToCart(product)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                            title="Add to Cart"
                          >
                            <Plus size={18} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-text-muted">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="text-xl font-medium text-white mb-2">No products found</p>
                      <p className="text-sm">Try adjusting your search or category filter.</p>
                      <Button variant="outline" className="mt-6 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black transition-all" onClick={onAddNewProduct}>
                        Add New Product
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-card-border/50 bg-surface px-6 py-4 flex justify-between items-center z-10">
              <p className="text-sm text-slate-400 font-medium">
                Showing <span className="text-white">{filteredProducts.length}</span> of {products.length} products
              </p>
              <Button variant="primary" onClick={onClose} className="px-10 h-[44px] shadow-lg shadow-amber-500/20 text-black font-bold">
                Done Browsing
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductCatalogModal;
