import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-white px-3 py-2 text-sm text-text-main outline-none focus:border-primary";

const BillingFormModal = ({ isOpen, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      purchaser: "",
      address: "",
      gstin: "",
      stateCode: "",
      phone: "",
      invoiceNo: "",
      date: "",
      transporter: "",
      vehicleNo: "",
      mobile: "",
      itemDescription: "",
      hsnCode: "",
      quantity: "",
      units: "",
      rate: "",
      grossAmount: "",
      netAmount: "",
      spotDiscount: "",
      splSeaDiscount: "",
      otherDiscount: "",
      taxableAmount: "",
      cgst: "",
      sgst: "",
      igst: "",
      roundOff: "",
      grandTotal: "",
    },
  });

  const submitHandler = (values) => {
    if (onSave) {
      onSave(values);
    }
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center glass-overlay px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white p-6 shadow-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-main">New Billing Invoice</h3>
                <p className="text-sm text-text-muted">
                  Complete the bill details and save the invoice.
                </p>
              </div>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={handleSubmit(submitHandler)}
              >
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Purchaser
                </label>
                <input
                  className={inputStyles}
                  {...register("purchaser", { required: true })}
                />
                {errors.purchaser && (
                  <p className="mt-1 text-xs text-red-500">
                    Purchaser is required.
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Address
                </label>
                <input
                  className={inputStyles}
                  {...register("address", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  GSTIN
                </label>
                <input className={inputStyles} {...register("gstin")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  State Code
                </label>
                <input className={inputStyles} {...register("stateCode")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Phone
                </label>
                <input className={inputStyles} {...register("phone")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Mobile
                </label>
                <input className={inputStyles} {...register("mobile")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Invoice No
                </label>
                <input className={inputStyles} {...register("invoiceNo")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Date
                </label>
                <input type="date" className={inputStyles} {...register("date")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Transporter
                </label>
                <input className={inputStyles} {...register("transporter")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Vehicle No
                </label>
                <input className={inputStyles} {...register("vehicleNo")} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-text-muted">
                  Item Description
                </label>
                <input className={inputStyles} {...register("itemDescription")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  HSN Code
                </label>
                <input className={inputStyles} {...register("hsnCode")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Quantity
                </label>
                <input type="number" className={inputStyles} {...register("quantity")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Units
                </label>
                <input className={inputStyles} {...register("units")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Rate (₹)
                </label>
                <input type="number" className={inputStyles} {...register("rate")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Gross Amount (₹)
                </label>
                <input type="number" className={inputStyles} {...register("grossAmount")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Net Amount (₹)
                </label>
                <input type="number" className={inputStyles} {...register("netAmount")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Spot Disc %
                </label>
                <input type="number" className={inputStyles} {...register("spotDiscount")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Spl/Sea Disc
                </label>
                <input type="number" className={inputStyles} {...register("splSeaDiscount")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Other Disc
                </label>
                <input type="number" className={inputStyles} {...register("otherDiscount")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Taxable Amount (₹)
                </label>
                <input type="number" className={inputStyles} {...register("taxableAmount")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  CGST %
                </label>
                <input type="number" className={inputStyles} {...register("cgst")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  SGST %
                </label>
                <input type="number" className={inputStyles} {...register("sgst")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  IGST %
                </label>
                <input type="number" className={inputStyles} {...register("igst")} />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Round Off
                </label>
                <input type="number" className={inputStyles} {...register("roundOff")} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-text-muted">
                  Grand Total (₹)
                </label>
                <input type="number" className={inputStyles} {...register("grandTotal")} />
              </div>

              <div className="col-span-2 mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="ghost" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Bill
                </Button>
              </div>
            </form>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BillingFormModal;
