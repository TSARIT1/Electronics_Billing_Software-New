import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";
import { login } from "../../services/auth";
import useStore from "../../store/useStore";

const inputStyles =
  "w-full rounded-xl border border-amber-500/20 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 shadow-inner shadow-amber-500/5 transition duration-300";

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
        role: user.role,
        phone: user.phone || "",
        shopId: user.shopId || null,
        shopName: user.shopName || "",
        planName: user.planName || "No Plan",
        subscriptionExpiresAt: user.subscriptionExpiresAt || null,
      });
      if (user.role === "SUPER_ADMIN") {
        navigate("/super-admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err?.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)] bg-[#020717] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[32px] border border-amber-500/20 bg-slate-950/80 shadow-[0_0_60px_rgba(245,158,11,0.1)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden overflow-hidden bg-slate-900 p-8 text-white lg:flex lg:flex-col lg:justify-between border-r border-amber-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.2),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.1),transparent_40%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Sparkles size={14} />
              ElectroShop
            </div>
            <h1 className="mt-6 max-w-md text-4xl font-light tracking-tight leading-tight">
              Turn inventory into a <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">premium retail</span> experience.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 font-light">
              Sign in to continue to a dashboard that keeps inventory, billing, purchases, and reports in one luxurious workspace.
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
                <div key={item.title} className="rounded-2xl border border-amber-500/10 bg-slate-950/50 p-4 backdrop-blur-md shadow-inner shadow-amber-500/5 transition hover:bg-slate-900 hover:border-amber-500/20">
                  <div className="text-amber-400"><Icon size={18} /></div>
                  <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444] text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-2xl font-semibold text-white">
                Secure Login
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Authenticate to access your workspace
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
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
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
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

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-900/50 text-amber-500 focus:ring-amber-500/50" />
                  Remember me
                </label>
                <button type="button" className="text-amber-500 hover:text-amber-400 transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ef4444] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(245,158,11,0.3)] transition duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 mt-2"
              >
                Access Dashboard
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                Create one
              </Link>
            </p>
            <p className="mt-2 text-center text-xs text-slate-400">
              Want to preview the platform first?{" "}
              <Link to="/" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                Explore the landing page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
