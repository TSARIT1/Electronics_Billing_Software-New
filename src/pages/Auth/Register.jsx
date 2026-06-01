import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";
import { register as registerUser } from "../../services/auth";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-surface px-3 py-2 text-sm text-text-main outline-none focus:border-primary dark:bg-surface-alt";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submitHandler = async (values) => {
    try {
      await registerUser(values);
      toast.success(`Account created for ${values.email}`);
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.18),transparent_28%),linear-gradient(180deg,rgba(245,247,251,1),rgba(237,242,255,1))] px-4 py-8 transition-colors dark:bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.22),transparent_28%),linear-gradient(180deg,rgba(7,16,39,1),rgba(11,18,48,1))]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[32px] border border-card-border bg-surface shadow-2xl lg:grid-cols-[0.95fr_1.05fr] dark:bg-surface-alt dark:border-slate-700">
        <div className="order-2 flex items-center justify-center p-6 sm:p-8 lg:order-1">
          <div className="w-full max-w-lg">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-glow">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-2xl font-semibold text-text-main">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-text-muted">
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

        <div className="relative order-1 hidden overflow-hidden bg-gradient-to-br from-sidebar-start via-primary to-[#7C3AED] p-8 text-white lg:order-2 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_24%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
              <Sparkles size={14} />
              Start here
            </div>
            <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
              Build a modern retail workflow with a polished, theme-aware interface.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/75">
              Create your account and unlock inventory, billing, purchase management, and analytics in one place.
            </p>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { title: "Fast setup", text: "Register and start using the workspace immediately.", icon: ArrowRight },
              { title: "Clean forms", text: "High-contrast inputs stay legible in both modes.", icon: ShieldCheck },
              { title: "Beautiful layout", text: "Balanced spacing and stronger visual hierarchy.", icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <Icon size={18} />
                  <p className="mt-3 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-white/70">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
