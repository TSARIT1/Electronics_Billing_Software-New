import { motion } from "framer-motion";
import Card from "../ui/Card";

const accentStyles = {
  primary: "bg-indigo-100 text-indigo-600",
  success: "bg-emerald-100 text-emerald-600",
  warning: "bg-amber-100 text-amber-600",
  danger: "bg-red-100 text-red-600",
};

const StatCard = ({ title, value, change, icon: Icon, accent = "primary" }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-text-main">{value}</p>
          {change && (
            <p className="mt-1 text-xs font-semibold text-emerald-600">{change}</p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            accentStyles[accent] || accentStyles.primary
          }`}
        >
          {Icon ? <Icon size={22} /> : null}
        </div>
      </div>
    </Card>
  </motion.div>
);

export default StatCard;
