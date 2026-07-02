import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-surface px-3 py-2 text-sm text-text-main outline-none focus:border-primary dark:bg-surface-alt";

const ProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: profile,
  });

  const submitHandler = (values) => {
    onSave(values);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-black/55 px-4 py-6 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
              className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-card-border bg-surface shadow-2xl dark:border-slate-700 dark:bg-surface-alt"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
              <div className="bg-gradient-to-r from-primary/10 via-surface to-surface-alt px-7 py-6 dark:from-primary/20 dark:via-surface-alt dark:to-surface">
              <h3 className="text-lg font-semibold text-text-main">
                Edit Profile
              </h3>
                <p className="mt-1 text-sm text-text-muted">
                Update your personal details and save changes.
              </p>
            </div>

            <form
                className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto px-7 py-6 pr-1 md:grid-cols-2"
              onSubmit={handleSubmit(submitHandler)}
            >
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Full Name
                </label>
                <input
                  className={inputStyles}
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    Name is required.
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Role/Title
                </label>
                <input
                  className={inputStyles}
                  {...register("role", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Shop Name
                </label>
                <input
                  className={`${inputStyles} opacity-70`}
                  {...register("shopName")}
                  readOnly
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Email
                </label>
                <input
                  className={inputStyles}
                  type="email"
                  {...register("email", { required: true })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted">
                  Phone
                </label>
                <input
                  className={inputStyles}
                  {...register("phone", { required: true })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-text-muted">
                  Avatar URL
                </label>
                <input
                  className={inputStyles}
                  placeholder="https://example.com/avatar.jpg"
                  {...register("avatarUrl")}
                />
              </div>

              <div className="col-span-1 mt-2 flex justify-end gap-3 md:col-span-2">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Profile
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
