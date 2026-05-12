import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-white px-3 py-2 text-sm text-text-main outline-none focus:border-primary";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const submitHandler = (values) => {
    toast.success(`Account created for ${values.email}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-4">
      <div className="w-full max-w-lg rounded-2xl border border-card-border bg-white p-6 shadow-card">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-text-main">
            Create your ElectroShop account
          </h1>
          <p className="text-sm text-text-muted">
            Get started with your management workspace
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
          <div>
            <label className="text-xs font-semibold text-text-muted">
              Full Name
            </label>
            <input
              className={inputStyles}
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">Name is required.</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted">
              Email Address
            </label>
            <input
              type="email"
              className={inputStyles}
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">Email is required.</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted">
              Phone
            </label>
            <input
              className={inputStyles}
              {...register("phone", { required: true })}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">Phone is required.</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted">
              Password
            </label>
            <input
              type="password"
              className={inputStyles}
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                Password must be at least 6 characters.
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted">
              Confirm Password
            </label>
            <input
              type="password"
              className={inputStyles}
              {...register("confirmPassword", {
                required: true,
                validate: (value) => value === watch("password"),
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                Passwords do not match.
              </p>
            )}
          </div>

          <Button className="w-full" type="submit">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
