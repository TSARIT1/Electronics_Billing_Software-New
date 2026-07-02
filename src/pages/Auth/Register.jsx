import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button";
import { register as registerUser } from "../../services/auth";

const inputStyles =
  "w-full rounded-xl border border-amber-500/20 bg-slate-900/50 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 shadow-inner shadow-amber-500/5 transition duration-300";

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
      if (!values.role) values.role = "ADMIN";
      await registerUser(values);
      toast.success(`Account created for ${values.email}`);
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)] bg-[#020717] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[32px] border border-amber-500/20 bg-slate-950/80 shadow-[0_0_60px_rgba(245,158,11,0.1)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="order-2 flex items-center justify-center p-6 sm:p-8 lg:order-1">
          <div className="w-full max-w-lg">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444] text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-2xl font-semibold text-white">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Register your shop or join an existing workspace.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
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
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
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
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                  Shop Name
                </label>
                <input
                  className={inputStyles}
                  placeholder="e.g. My Electronics Store"
                  {...register("shopName", { required: true })}
                />
                {errors.shopName && (
                  <p className="mt-1 text-xs text-red-500">Shop name is required.</p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                  Role
                </label>
                <select className={inputStyles} {...register("role", { required: true })}>
                  <option value="ADMIN">Administrator (Shop Owner)</option>
                  <option value="MANAGER">Manager</option>
                  <option value="STAFF">Staff Member</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
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

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ef4444] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(245,158,11,0.3)] transition duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 mt-4"
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="relative order-1 hidden overflow-hidden bg-slate-900 p-8 text-white lg:order-2 lg:flex lg:flex-col lg:justify-between border-l border-amber-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.1),transparent_40%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Sparkles size={14} />
              Start here
            </div>
            <h1 className="mt-6 max-w-md text-4xl font-light tracking-tight leading-tight">
              Build a modern retail workflow with a <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">polished, premium</span> interface.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 font-light">
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
                <div key={item.title} className="rounded-2xl border border-amber-500/10 bg-slate-950/50 p-4 backdrop-blur-md shadow-inner shadow-amber-500/5 transition hover:bg-slate-900 hover:border-amber-500/20">
                  <div className="text-amber-400"><Icon size={18} /></div>
                  <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{item.text}</p>
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
