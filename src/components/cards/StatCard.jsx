import { motion } from "framer-motion";
import Card from "../ui/Card";

const accentStyles = {
  primary: "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
  success: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
  warning: "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]",
  danger: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
};

const StatCard = ({ title, value, change, icon: Icon, accent = "primary" }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <Card className="p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-light text-white tracking-tight">{value}</p>
          {change && (
            <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 inline-block px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">{change}</p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            accentStyles[accent] || accentStyles.primary
          }`}
        >
          {Icon ? <Icon size={22} strokeWidth={2.2} /> : null}
        </div>
      </div>
    </Card>
  </motion.div>
);

export default StatCard;
