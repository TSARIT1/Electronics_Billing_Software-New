import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Shield, Sparkles, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { login } from "../../services/auth";
import useStore from "../../store/useStore";
import { motion } from "framer-motion";
import { useState } from "react";

const inputStyles =
  "w-full rounded-xl border border-purple-500/20 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 shadow-inner shadow-purple-500/5 transition duration-300";

const SuperAdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const updateProfile = useStore((state) => state.updateProfile);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (values) => {
    try {
      const user = await login(values);

      if (user.role !== "SUPER_ADMIN") {
        // Not a super admin — clear the session and reject
        localStorage.removeItem("es_session");
        toast.error("Access denied. Super Admin credentials required.");
        return;
      }

      toast.success("Welcome back, Super Admin");
      updateProfile({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        shopId: user.shopId || null,
        shopName: user.shopName || "",
      });
      navigate("/super-admin");
    } catch (err) {
      const message = err?.message || "Authentication failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#020717] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background effects */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.15),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.1),transparent_30%)]"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_50%)]"
      />

      {/* Back to landing link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-slate-950/80 px-4 py-2 text-xs text-slate-400 backdrop-blur-md transition hover:text-purple-300 hover:border-purple-400/30"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glowing card container */}
        <div className="rounded-[32px] border border-purple-500/20 bg-slate-950/90 p-8 shadow-[0_0_80px_rgba(147,51,234,0.12)] backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 text-white shadow-[0_0_40px_rgba(147,51,234,0.5)]"
            >
              <Shield className="h-8 w-8" />
            </motion.div>
            <h1 className="text-2xl font-semibold text-white">
              Super Admin Access
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Restricted portal — authorized personnel only
            </p>
          </div>

          {/* Security badge */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-purple-500/10 bg-purple-500/5 px-4 py-3">
            <Lock className="h-4 w-4 text-purple-400 flex-shrink-0" />
            <p className="text-xs text-purple-300/80">
              This is a secured access point. All login attempts are monitored and logged.
            </p>
          </div>

          {/* Login form */}
          <form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@electroshop.com"
                className={inputStyles}
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">Email is required.</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  className={`${inputStyles} pr-11`}
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">Password is required.</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(147,51,234,0.35)] transition duration-300 hover:shadow-[0_0_50px_rgba(147,51,234,0.55)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Authenticate
                </>
              )}
            </motion.button>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-slate-500">
              Regular user?{" "}
              <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                Go to standard login
              </Link>
            </p>
            <p className="text-xs text-slate-500">
              Explore the platform?{" "}
              <Link to="/" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                Visit landing page
              </Link>
            </p>
          </div>
        </div>

        {/* Branding footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-slate-600">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs tracking-[0.2em] uppercase">ElectroShop Admin Portal</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperAdminLogin;
