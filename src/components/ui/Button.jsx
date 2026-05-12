const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition";

const variantStyles = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  success: "bg-success text-white hover:bg-emerald-600",
  danger: "bg-danger text-white hover:bg-red-600",
  warning: "bg-warning text-white hover:bg-amber-500",
  ghost: "bg-white text-text-main border border-card-border hover:bg-slate-50",
  outline: "border border-primary text-primary hover:bg-primary/10",
};

const Button = ({ variant = "primary", className = "", ...props }) => (
  <button
    className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${className}`}
    type="button"
    {...props}
  />
);

export default Button;
