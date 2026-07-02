import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";
import InvoicePreview from "../invoice/InvoicePreview";
import { X } from "lucide-react";

const InvoiceModal = ({ isOpen, onClose, details, items }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center glass-overlay px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-[2rem] border border-card-border bg-[#020717] shadow-2xl relative flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/10 bg-slate-900/50 backdrop-blur-md">
              <div>
                <h3 className="text-lg font-bold text-white">Generated Invoice</h3>
                <p className="text-xs text-slate-400">Review, print or download the generated bill</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <InvoicePreview details={details} items={items} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InvoiceModal;
