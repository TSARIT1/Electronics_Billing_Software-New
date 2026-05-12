const badgeStyles = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-indigo-100 text-indigo-700",
  neutral: "bg-slate-100 text-slate-600",
};

const Badge = ({ variant = "neutral", className = "", children }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      badgeStyles[variant] || badgeStyles.neutral
    } ${className}`}
  >
    {children}
  </span>
);

export default Badge;
