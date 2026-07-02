import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Activity,
  ArrowRight,
  BellRing,
  CheckCheck,
  Clock3,
  Filter,
  Sparkles,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import SearchInput from "../../components/ui/SearchInput";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  createNotification
} from "../../services/notifications";

const typeMeta = {
  success: {
    label: "Success",
    accent: "from-emerald-500 to-emerald-700",
    chip: "success",
    icon: CheckCheck,
  },
  warning: {
    label: "Warning",
    accent: "from-amber-500 to-amber-700",
    chip: "warning",
    icon: Filter,
  },
  danger: {
    label: "Critical",
    accent: "from-red-500 to-rose-700",
    chip: "danger",
    icon: BellRing,
  },
  info: {
    label: "Info",
    accent: "from-slate-500 to-slate-700",
    chip: "info",
    icon: Sparkles,
  },
};

const formatTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Just now"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const NotificationItem = ({ notification, meta, onToggleRead, onDismiss }) => {
  const Icon = meta.icon;

  return (
    <div
      className={`group overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-950/50 backdrop-blur-md shadow-inner shadow-amber-500/5 transition duration-300 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 ${
        notification.read ? "opacity-60 grayscale-[30%]" : ""
      }`}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${meta.accent} opacity-80`} />
      <div className="flex gap-4 p-5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.accent} text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-white">
                  {notification.title}
                </h3>
                <Badge variant={meta.chip}>{meta.label}</Badge>
                {!notification.read ? (
                  <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                ) : null}
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400 font-light">
                {notification.message}
              </p>
            </div>
            <p className="flex shrink-0 items-center gap-2 text-xs text-slate-500 font-medium">
              <Clock3 size={14} />
              {formatTime(notification.createdAt || notification.time)}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100 sm:opacity-100">
            {!notification.read && (
              <button
                type="button"
                className="rounded-full border border-amber-500/20 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-amber-500 transition hover:bg-amber-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                onClick={() => onToggleRead(notification.id)}
              >
                Mark as read
              </button>
            )}
            <button
              type="button"
              className="rounded-full border border-red-500/20 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              onClick={() => onDismiss(notification.id)}
            >
              Dismiss alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleToggleRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success("All caught up");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDismiss = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Alert dismissed");
    } catch (err) {
      toast.error("Failed to dismiss alert");
    }
  };

  const handleClearAll = async () => {
    try {
      await clearNotifications();
      setNotifications([]);
      toast.success("Inbox cleared");
    } catch (err) {
      toast.error("Failed to clear inbox");
    }
  };

  const handleSeedDemoAlert = async () => {
    try {
      await createNotification({
        title: "Demo alert created",
        message: "This is a live example notification to test the page actions.",
        type: "info"
      });
      await fetchNotifications();
      toast.success("Demo alert created");
    } catch (err) {
      toast.error("Failed to create demo alert");
    }
  };

  const filteredNotifications = useMemo(() => {
    const term = query.trim().toLowerCase();
    const items = notifications.filter((item) => {
      const matchesTab =
        tab === "all" ||
        (tab === "unread" && !item.read) ||
        (tab === "read" && item.read);
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesQuery =
        !term ||
        [item.title, item.message, item.type]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      return matchesTab && matchesType && matchesQuery;
    });

    return items.sort((a, b) => {
      const diff = new Date(b.createdAt || b.time).getTime() - new Date(a.createdAt || a.time).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });
  }, [notifications, query, sortOrder, tab, typeFilter]);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const criticalCount = notifications.filter((item) => item.type === "danger" || item.type === "warning").length;
  const newestUnread = notifications.find((item) => !item.read) || notifications[0] || null;
  const priorityNotifications = filteredNotifications.filter(
    (item) => !item.read || item.type === "danger" || item.type === "warning",
  );
  const regularNotifications = filteredNotifications.filter(
    (item) => item.read && item.type !== "danger" && item.type !== "warning",
  );

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border border-amber-500/20 bg-[#020717] text-white shadow-[0_0_40px_rgba(245,158,11,0.05)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.08),transparent_40%)]" />
        <div className="relative grid gap-6 px-6 py-8 lg:grid-cols-[1.4fr_0.9fr] lg:px-10 lg:py-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Sparkles size={14} />
              Notification Center
            </div>
            <h1 className="mt-6 max-w-3xl text-3xl font-light tracking-tight leading-tight sm:text-4xl text-white">
              Stay on top of your <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">workspace</span>.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 font-light">
              Review critical system alerts, manage workflow updates, and keep your inbox clean with a focused premium interface.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] border-none"
                onClick={handleMarkAllRead}
              >
                <CheckCheck size={16} />
                Mark all read
              </Button>
              <Button
                variant="outline"
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50"
                onClick={handleSeedDemoAlert}
              >
                <BellRing size={16} />
                Generate demo alert
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-2xl border border-amber-500/10 bg-slate-950/40 p-5 backdrop-blur shadow-inner shadow-amber-500/5 transition hover:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total Inbox</p>
              <p className="mt-3 text-3xl font-light text-white">{notifications.length}</p>
              <p className="mt-1 text-xs text-slate-500">Historical volume</p>
            </div>
            <div className="rounded-2xl border border-amber-500/10 bg-slate-950/40 p-5 backdrop-blur shadow-inner shadow-amber-500/5 transition hover:bg-slate-900/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500"><BellRing size={48} /></div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 relative z-10">Unread</p>
              <p className="mt-3 text-3xl font-semibold text-amber-400 relative z-10">{unreadCount}</p>
              <p className="mt-1 text-xs text-slate-500 relative z-10">Needs attention</p>
            </div>
            <div className="rounded-2xl border border-red-500/10 bg-slate-950/40 p-5 backdrop-blur shadow-inner shadow-red-500/5 transition hover:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Critical</p>
              <p className="mt-3 text-3xl font-light text-white">{criticalCount}</p>
              <p className="mt-1 text-xs text-slate-500">High priority items</p>
            </div>
            <div className="rounded-2xl border border-amber-500/10 bg-slate-950/40 p-5 backdrop-blur shadow-inner shadow-amber-500/5 transition hover:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Latest Event</p>
              <p className="mt-3 text-sm font-medium text-amber-300 truncate">
                {newestUnread ? newestUnread.title : "All clear"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {newestUnread ? formatTime(newestUnread.createdAt || newestUnread.time) : "Nothing pending right now"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <Card className="overflow-hidden p-0 border-amber-500/10 bg-slate-950/50">
          <div className="border-b border-amber-500/10 px-6 py-6 bg-slate-900/30">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                  <Activity size={14} />
                  Live Activity Stream
                </div>
                <h2 className="mt-4 text-xl font-medium text-white">
                  Inbox Overview
                </h2>
                <p className="mt-1.5 text-sm text-slate-400 font-light">
                  {unreadCount} pending review, {notifications.length} total messages.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="min-w-[260px]">
                  <SearchInput
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search titles or messages..."
                  />
                </div>
                <Button variant="outline" className="border-amber-500/20 text-slate-300" onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest") }>
                  <Clock3 size={16} className="text-amber-500" />
                  {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Items" },
                { key: "unread", label: "Unread" },
                { key: "read", label: "Read" },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`rounded-full px-5 py-2 text-xs font-bold transition duration-300 ${
                    tab === option.key
                      ? "bg-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/30"
                      : "bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  onClick={() => setTab(option.key)}
                >
                  {option.label}
                </button>
              ))}
              
              <div className="w-px h-6 bg-amber-500/10 mx-2 self-center hidden sm:block"></div>

              {[
                { key: "all", label: "All Types" },
                { key: "info", label: "Info" },
                { key: "success", label: "Success" },
                { key: "warning", label: "Warning" },
                { key: "danger", label: "Critical" },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition duration-300 ${
                    typeFilter === option.key
                      ? "bg-slate-800 text-white shadow-inner shadow-white/5 ring-1 ring-slate-600"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                  }`}
                  onClick={() => setTypeFilter(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            {loading ? (
               <div className="flex justify-center p-10"><div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div></div>
            ) : filteredNotifications.length > 0 ? (
              <>
                {priorityNotifications.length > 0 ? (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500/80">
                          Priority Inbox
                        </h3>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Unread and critical alerts demanding attention.
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 ring-1 ring-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                        {priorityNotifications.length} items
                      </span>
                    </div>
                    <div className="space-y-4">
                      {priorityNotifications.map((notification) => {
                        const meta = typeMeta[notification.type] || typeMeta.info;
                        return (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            meta={meta}
                            onToggleRead={handleToggleRead}
                            onDismiss={handleDismiss}
                          />
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {regularNotifications.length > 0 ? (
                  <section className="space-y-4 mt-8">
                    <div className="flex items-center justify-between border-t border-amber-500/10 pt-8">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                          Activity Archive
                        </h3>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Cleared items and standard background updates.
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-slate-400 ring-1 ring-slate-800">
                        {regularNotifications.length} items
                      </span>
                    </div>
                    <div className="space-y-4 opacity-80">
                      {regularNotifications.map((notification) => {
                        const meta = typeMeta[notification.type] || typeMeta.info;
                        return (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            meta={meta}
                            onToggleRead={handleToggleRead}
                            onDismiss={handleDismiss}
                          />
                        );
                      })}
                    </div>
                  </section>
                ) : null}
              </>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-amber-500/20 bg-slate-950/30 px-6 py-12 text-center shadow-inner shadow-amber-500/5">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 shadow-[0_0_30px_rgba(245,158,11,0.1)] ring-1 ring-amber-500/20">
                  <BellRing className="text-amber-500" size={32} />
                </div>
                <h3 className="mt-6 text-2xl font-light text-white">
                  No alerts present
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400 font-light">
                  Your inbox is completely clear. You can trigger a demo alert to visualize the layout.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button className="bg-amber-500 text-slate-950 hover:bg-amber-400" onClick={handleSeedDemoAlert}>
                    <Sparkles size={16} />
                    Simulate alert
                  </Button>
                  {query && (
                    <Button variant="outline" className="border-amber-500/20 text-slate-300" onClick={() => setQuery("")}>
                      <X size={16} />
                      Clear search
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 border-amber-500/10 bg-slate-950/60 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-white">Quick Flow</h3>
                <p className="mt-1 text-xs text-slate-400 font-light">Batch operations</p>
              </div>
              <ShieldAlert className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" size={20} />
            </div>
            <div className="grid gap-3">
              <Button onClick={handleMarkAllRead} className="bg-slate-900 border border-amber-500/20 hover:border-amber-500/50 text-white w-full justify-start">
                <CheckCheck size={16} className="text-amber-500 mr-2" />
                Clear unread badges
              </Button>
              <Button onClick={handleClearAll} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 w-full justify-start">
                <Trash2 size={16} className="mr-2" />
                Delete all history
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-amber-500/10 bg-slate-950/60 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-white mb-5">Event Legend</h3>
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
                  <CheckCheck size={12} />
                </div>
                <div>
                  <p className="font-semibold text-white">Success</p>
                  <p className="mt-0.5 text-xs text-slate-400 font-light">Confirmed actions & saves.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
                  <Filter size={12} />
                </div>
                <div>
                  <p className="font-semibold text-white">Warning</p>
                  <p className="mt-0.5 text-xs text-slate-400 font-light">Requires manual review soon.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400 ring-1 ring-red-500/30">
                  <BellRing size={12} />
                </div>
                <div>
                  <p className="font-semibold text-white">Critical</p>
                  <p className="mt-0.5 text-xs text-slate-400 font-light">Immediate action required.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;