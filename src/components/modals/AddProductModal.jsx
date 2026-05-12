import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-white px-3 py-2 text-sm text-text-main outline-none focus:border-primary";

const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitHandler = (values) => {
    onSave(values);
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
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-main">
                Add New Product
              </h3>
              <p className="text-sm text-text-muted">
                Fill in the details to add a product to inventory.
              </p>
            </div>

            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={handleSubmit(submitHandler)}
            >
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Product Name
                </label>
                <input
                  className={inputStyles}
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    Product name is required.
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Brand
                </label>
                <input
                  className={inputStyles}
                  {...register("brand", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Category
                </label>
                <input
                  className={inputStyles}
                  {...register("category", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">SKU</label>
                <input
                  className={inputStyles}
                  {...register("sku", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  HSN Code
                </label>
                <input
                  className={inputStyles}
                  {...register("hsn", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Cost Price
                </label>
                <input
                  className={inputStyles}
                  {...register("cost", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Selling Price
                </label>
                <input
                  className={inputStyles}
                  {...register("price", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Stock Quantity
                </label>
                <input
                  className={inputStyles}
                  {...register("stock", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Min Stock Alert
                </label>
                <input
                  className={inputStyles}
                  {...register("minStock", { required: true })}
                />
              </div>

              <div className="col-span-1 mt-2 flex justify-end gap-3 md:col-span-2">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Product
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddProductModal;
