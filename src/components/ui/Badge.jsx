const badgeStyles = {
  success: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
  warning: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
  danger: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
  info: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]",
  neutral: "bg-slate-800 text-slate-300 ring-1 ring-slate-600 shadow-inner",
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
