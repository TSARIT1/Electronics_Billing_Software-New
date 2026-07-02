import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Store, Users, TrendingUp, CreditCard } from "lucide-react";
import { getDashboardStats } from "../../services/superAdmin";

const AnimatedCounter = ({ target, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Number(target) || 0;
    if (end === 0) return;
    const step = Math.ceil(end / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count}</span>;
};

const SADashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        {
          title: "Total Stores",
          value: stats.totalStores,
          icon: Store,
          gradient: "from-blue-500/20 to-cyan-500/15",
          iconColor: "text-blue-400",
          iconBg: "bg-blue-500/10",
        },
        {
          title: "Total Users",
          value: stats.totalUsers,
          icon: Users,
          gradient: "from-emerald-500/20 to-green-500/15",
          iconColor: "text-emerald-400",
          iconBg: "bg-emerald-500/10",
        },
        {
          title: "New This Month",
          value: stats.newThisMonth,
          icon: TrendingUp,
          gradient: "from-amber-500/20 to-yellow-500/15",
          iconColor: "text-amber-400",
          iconBg: "bg-amber-500/10",
        },
      ]
    : [];

  const subDistribution = stats?.subscriptionDistribution || {};

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)]"
      >
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Super Admin Dashboard
        </h1>
        <p className="mt-2 text-base text-white/70">
          Complete overview of all ElectroShop stores and system statistics
        </p>
      </motion.div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-[24px] border border-amber-500/10 bg-slate-900/60"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-[24px] border border-amber-500/15 bg-slate-950/90 p-6 shadow-2xl backdrop-blur-lg transition-all hover:border-amber-400/30 hover:shadow-[0_10px_40px_rgba(245,158,11,0.08)]"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-4xl font-bold text-white">
                  <AnimatedCounter target={card.value} />
                </p>
                <p className="mt-1 text-sm text-slate-400">{card.title}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Subscription Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="rounded-[28px] border border-amber-500/15 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">
            Subscription Distribution
          </h2>
        </div>
        {Object.keys(subDistribution).length === 0 ? (
          <p className="text-sm text-slate-400">No subscription data yet.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(subDistribution).map(([plan, count], idx) => {
              const totalStores = stats?.totalStores || 1;
              const percentage = Math.round((count / totalStores) * 100);
              const colors = [
                "from-blue-500 to-blue-600",
                "from-emerald-500 to-emerald-600",
                "from-amber-500 to-amber-600",
                "from-purple-500 to-purple-600",
                "from-pink-500 to-pink-600",
              ];
              return (
                <motion.div
                  key={plan}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">
                      {plan}
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {count}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${colors[idx % colors.length]}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="rounded-[28px] border border-amber-500/15 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-lg"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "View All Stores",
              href: "/super-admin/stores",
              color: "from-blue-500/20 to-cyan-500/10",
              border: "border-blue-500/20 hover:border-blue-400/40",
            },
            {
              label: "Manage Subscriptions",
              href: "/super-admin/subscriptions",
              color: "from-emerald-500/20 to-green-500/10",
              border: "border-emerald-500/20 hover:border-emerald-400/40",
            },
            {
              label: "Support Tickets",
              href: "/super-admin/tickets",
              color: "from-purple-500/20 to-pink-500/10",
              border: "border-purple-500/20 hover:border-purple-400/40",
            },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`rounded-2xl border ${action.border} bg-gradient-to-br ${action.color} px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg text-center`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SADashboard;
