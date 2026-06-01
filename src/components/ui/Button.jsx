const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 shadow-sm hover:-translate-y-0.5 active:translate-y-0";

const variantStyles = {
  primary: "bg-gradient-to-r from-primary to-primary-dark text-white shadow-glow hover:brightness-110",
  success: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_10px_24px_rgba(34,197,94,0.28)] hover:brightness-110",
  danger: "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-[0_10px_24px_rgba(239,68,68,0.28)] hover:brightness-110",
  warning: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_10px_24px_rgba(245,158,11,0.24)] hover:brightness-110",
  ghost: "border border-card-border bg-surface text-text-main hover:bg-surface-alt dark:bg-surface-alt dark:hover:bg-surface",
  outline: "border border-primary/30 bg-primary/5 text-primary hover:border-primary hover:bg-primary/10",
};

const Button = ({ variant = "primary", className = "", ...props }) => (
  <button
    className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${className}`}
    type="button"
    {...props}
  />
);

export default Button;
