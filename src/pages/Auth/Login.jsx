import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";
import { login } from "../../services/auth";
import useStore from "../../store/useStore";

const inputStyles =
  "w-full rounded-xl border border-card-border bg-surface px-3 py-2 text-sm text-text-main outline-none focus:border-primary dark:bg-surface-alt";

const Login = () => {
  const devDefaults = process.env.NODE_ENV === "development" ? { email: "admin@local.test", password: "password" } : {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: devDefaults });

  const navigate = useNavigate();
  const updateProfile = useStore((state) => state.updateProfile);

  const submitHandler = async (values) => {
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${values.email}`);
      // update global profile
      updateProfile({
        name: user.name,
        email: user.email,
        role: "Admin Manager",
        phone: user.phone || "",
      });
      navigate("/");
    } catch (err) {
      const message = err?.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.18),transparent_26%),linear-gradient(180deg,rgba(245,247,251,1),rgba(237,242,255,1))] px-4 py-8 transition-colors dark:bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.22),transparent_26%),linear-gradient(180deg,rgba(7,16,39,1),rgba(11,18,48,1))]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[32px] border border-card-border bg-surface shadow-2xl lg:grid-cols-[1.05fr_0.95fr] dark:bg-surface-alt dark:border-slate-700">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-sidebar-start via-primary to-[#7C3AED] p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_24%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
              <Sparkles size={14} />
              ElectroShop
            </div>
            <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
              Beautiful operations, clear visibility, and faster daily work.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/75">
              Sign in to continue to a dashboard that keeps inventory, billing, purchases, and reports in one clean workspace.
            </p>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-3">
            {[
              { title: "Secure access", text: "Protected workspace with live session state.", icon: ShieldCheck },
              { title: "Live sync", text: "Backend-driven inventory and billing flows.", icon: ArrowRight },
              { title: "Theme-aware", text: "Dark and light views stay readable and sharp.", icon: Sparkles },
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

        <div className="flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-glow">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-2xl font-semibold text-text-main">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-text-muted">
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
                  <input type="checkbox" className="h-4 w-4 accent-primary" />
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
      </div>
    </div>
  );
};

export default Login;
