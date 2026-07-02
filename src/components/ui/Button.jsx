const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 shadow-sm hover:-translate-y-0.5 active:translate-y-0";

const variantStyles = {
  primary: "bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]",
  success: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]",
  danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]",
  warning: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]",
  ghost: "border border-amber-500/10 bg-slate-900/50 text-slate-300 hover:text-white hover:border-amber-500/30 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  outline: "border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]",
};

const Button = ({ variant = "primary", className = "", ...props }) => (
  <button
    className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${className}`}
    type="button"
    {...props}
  />
);

export default Button;
