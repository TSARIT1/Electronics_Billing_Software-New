import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-white px-3 py-2 text-sm text-text-main outline-none focus:border-primary";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = (values) => {
    toast.success(`Welcome back, ${values.email}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-card-border bg-white p-6 shadow-card">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-text-main">
            ElectroShop Management System
          </h1>
          <p className="text-sm text-text-muted">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
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
              Password
            </label>
            <input
              type="password"
              className={inputStyles}
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                Password is required.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-text-muted">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              Remember me
            </label>
            <button type="button" className="text-primary">
              Forgot password?
            </button>
          </div>

          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-primary">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
