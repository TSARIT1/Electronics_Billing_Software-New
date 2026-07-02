import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-surface px-3 py-2 text-sm text-text-main outline-none focus:border-primary dark:bg-surface-alt";

const BillingFormModal = ({ isOpen, onClose, onSave, products = [] }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (values) => {
    if (!onSave) return;
    try {
      setIsSubmitting(true);
      await onSave(values);
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
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
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-card-border bg-surface shadow-2xl dark:border-slate-700 dark:bg-surface-alt"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
              <div className="mb-6 flex flex-col gap-2 border-b border-card-border bg-gradient-to-r from-primary/10 via-surface to-surface-alt px-6 py-5 md:flex-row md:items-end md:justify-between dark:border-slate-700 dark:from-primary/20 dark:via-surface-alt dark:to-surface">
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

              <div className="max-h-[70vh] overflow-y-auto px-6 pb-6 pr-1">
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
                <select className={inputStyles} {...register("stateCode")}>
                  <option value="">Select State</option>
                  <option value="01-Jammu & Kashmir">01-Jammu & Kashmir (UT)</option>
                  <option value="02-Himachal Pradesh">02-Himachal Pradesh</option>
                  <option value="03-Punjab">03-Punjab</option>
                  <option value="04-Chandigarh">04-Chandigarh (UT)</option>
                  <option value="05-Uttarakhand">05-Uttarakhand</option>
                  <option value="06-Haryana">06-Haryana</option>
                  <option value="07-Delhi">07-Delhi (UT)</option>
                  <option value="08-Rajasthan">08-Rajasthan</option>
                  <option value="09-Uttar Pradesh">09-Uttar Pradesh</option>
                  <option value="10-Bihar">10-Bihar</option>
                  <option value="11-Sikkim">11-Sikkim</option>
                  <option value="12-Arunachal Pradesh">12-Arunachal Pradesh</option>
                  <option value="13-Nagaland">13-Nagaland</option>
                  <option value="14-Manipur">14-Manipur</option>
                  <option value="15-Mizoram">15-Mizoram</option>
                  <option value="16-Tripura">16-Tripura</option>
                  <option value="17-Meghalaya">17-Meghalaya</option>
                  <option value="18-Assam">18-Assam</option>
                  <option value="19-West Bengal">19-West Bengal</option>
                  <option value="20-Jharkhand">20-Jharkhand</option>
                  <option value="21-Odisha">21-Odisha</option>
                  <option value="22-Chhattisgarh">22-Chhattisgarh</option>
                  <option value="23-Madhya Pradesh">23-Madhya Pradesh</option>
                  <option value="24-Gujarat">24-Gujarat</option>
                  <option value="26-Dadra & Nagar Haveli and Daman & Diu">26-Dadra & Nagar Haveli and Daman & Diu (UT)</option>
                  <option value="27-Maharashtra">27-Maharashtra</option>
                  <option value="29-Karnataka">29-Karnataka</option>
                  <option value="30-Goa">30-Goa</option>
                  <option value="31-Lakshadweep">31-Lakshadweep (UT)</option>
                  <option value="32-Kerala">32-Kerala</option>
                  <option value="33-Tamil Nadu">33-Tamil Nadu</option>
                  <option value="34-Puducherry">34-Puducherry (UT)</option>
                  <option value="35-Andaman and Nicobar Islands">35-Andaman and Nicobar Islands (UT)</option>
                  <option value="36-Telangana">36-Telangana</option>
                  <option value="37-Andhra Pradesh">37-Andhra Pradesh</option>
                  <option value="38-Ladakh">38-Ladakh (UT)</option>
                </select>
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
                  Select Product
                </label>
                <select
                  className={inputStyles}
                  {...register("productId", { required: true })}
                  onChange={(e) => {
                    const prodId = e.target.value;
                    const prod = products.find((p) => String(p.id) === String(prodId));
                    if (prod) {
                      setValue("itemDescription", prod.name);
                      setValue("rate", prod.price);
                      setValue("hsnCode", prod.hsn || "8517");
                    }
                  }}
                >
                  <option value="">Choose a product from inventory</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} (SKU: {prod.sku}) - Price: ₹{prod.price}
                    </option>
                  ))}
                </select>
                <input type="hidden" {...register("itemDescription")} />
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
                <select className={inputStyles} {...register("units")}>
                  <option value="Pcs">Pcs (Pieces)</option>
                  <option value="Box">Box</option>
                  <option value="Set">Set</option>
                  <option value="Kg">Kg</option>
                  <option value="Mtr">Mtr (Meters)</option>
                </select>
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
                <select className={inputStyles} {...register("cgst")}>
                  <option value="0">0%</option>
                  <option value="2.5">2.5%</option>
                  <option value="6">6%</option>
                  <option value="9">9%</option>
                  <option value="14">14%</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  SGST %
                </label>
                <select className={inputStyles} {...register("sgst")}>
                  <option value="0">0%</option>
                  <option value="2.5">2.5%</option>
                  <option value="6">6%</option>
                  <option value="9">9%</option>
                  <option value="14">14%</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  IGST %
                </label>
                <select className={inputStyles} {...register("igst")}>
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
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
                <Button variant="ghost" onClick={onClose} type="button" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Bill"}
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
