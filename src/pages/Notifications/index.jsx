import { useMemo, useState } from "react";
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
import useStore from "../../store/useStore";

const typeMeta = {
  success: {
    label: "Success",
    accent: "from-emerald-500 to-emerald-600",
    chip: "success",
    icon: CheckCheck,
  },
  warning: {
    label: "Warning",
    accent: "from-amber-500 to-orange-500",
    chip: "warning",
    icon: Filter,
  },
  danger: {
    label: "Critical",
    accent: "from-red-500 to-rose-500",
    chip: "danger",
    icon: BellRing,
  },
  info: {
    label: "Info",
    accent: "from-indigo-500 to-primary",
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
      className={`group overflow-hidden rounded-2xl border border-card-border bg-gradient-to-br from-surface via-surface to-surface-alt shadow-card transition hover:-translate-y-0.5 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900 ${
        notification.read ? "opacity-80" : ""
      }`}
    >
      <div className={`h-1 bg-gradient-to-r ${meta.accent}`} />
      <div className="flex gap-4 p-5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.accent} text-white shadow-glow`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-text-main dark:text-slate-100">
                  {notification.title}
                </h3>
                <Badge variant={meta.chip}>{meta.label}</Badge>
                {!notification.read ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                ) : null}
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted dark:text-slate-400">
                {notification.message}
              </p>
            </div>
            <p className="flex shrink-0 items-center gap-2 text-xs text-text-muted dark:text-slate-500">
              <Clock3 size={14} />
              {formatTime(notification.time)}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-card-border bg-white px-3 py-1 text-xs font-semibold text-text-muted transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500"
              onClick={() => onToggleRead(notification.id)}
            >
              {notification.read ? "Mark unread" : "Mark read"}
            </button>
            <button
              type="button"
                className="rounded-full border border-card-border bg-white px-3 py-1 text-xs font-semibold text-text-muted transition hover:border-danger hover:text-danger dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500"
              onClick={() => onDismiss(notification.id)}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    addNotification,
    deleteNotification,
  } = useStore();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

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
      const diff = new Date(b.time).getTime() - new Date(a.time).getTime();
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

  const handleSeedDemoAlert = () => {
    addNotification({
      title: "Demo alert created",
      message: "This is a live example notification to test the page actions.",
      type: "info",
    });
    toast.success("Demo notification added");
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-[#0F172A] via-[#1D1745] to-[#4338CA] text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="relative grid gap-6 px-6 py-6 lg:grid-cols-[1.4fr_0.9fr] lg:px-8 lg:py-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              <Sparkles size={14} />
              Notification Center
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
              Structured alerts, cleaner priorities, and a professional inbox for your workspace.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
              Keep critical events visible, sort out daily activity, and act fast with a more organized dashboard-style notification experience.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="bg-white text-[#1D1745] hover:bg-slate-100"
                onClick={() => markAllNotificationsRead()}
              >
                <CheckCheck size={16} />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                className="border-white/15 bg-white/10 text-white hover:bg-white/15 dark:border-white/15 dark:bg-white/10 dark:text-white"
                onClick={handleSeedDemoAlert}
              >
                <BellRing size={16} />
                Add demo alert
              </Button>
              <Button
                variant="ghost"
                className="border-white/15 bg-white/10 text-white hover:bg-white/15 dark:border-white/15 dark:bg-white/10 dark:text-white"
                onClick={() => clearNotifications()}
              >
                <Trash2 size={16} />
                Clear all
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Total</p>
              <p className="mt-2 text-3xl font-semibold">{notifications.length}</p>
              <p className="mt-1 text-sm text-white/65">Overall notification volume</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Unread</p>
              <p className="mt-2 text-3xl font-semibold">{unreadCount}</p>
              <p className="mt-1 text-sm text-white/65">Items awaiting review</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Critical</p>
              <p className="mt-2 text-3xl font-semibold">{criticalCount}</p>
              <p className="mt-1 text-sm text-white/65">Warnings and critical alerts</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Latest</p>
              <p className="mt-2 text-lg font-semibold">
                {newestUnread ? newestUnread.title : "All clear"}
              </p>
              <p className="mt-1 text-sm text-white/65">
                {newestUnread ? formatTime(newestUnread.time) : "Nothing pending right now"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-card-border px-5 py-5 dark:border-slate-700">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-50 to-indigo-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                  <Activity size={14} />
                  Live inbox
                </div>
                <h2 className="mt-3 text-lg font-semibold text-text-main dark:text-slate-100">
                  Notifications and activity stream
                </h2>
                <p className="mt-1 text-sm text-text-muted dark:text-slate-400">
                  {unreadCount} unread, {notifications.length} total, arranged by importance and time.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="min-w-[240px]">
                  <SearchInput
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search notifications"
                  />
                </div>
                <Button variant="ghost" onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest") }>
                  <Clock3 size={16} />
                  {sortOrder === "newest" ? "Newest first" : "Oldest first"}
                </Button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { key: "all", label: "All" },
                { key: "unread", label: "Unread" },
                { key: "read", label: "Read" },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    tab === option.key
                      ? "bg-primary text-white shadow-glow"
                      : "border border-card-border bg-gradient-to-r from-surface to-surface-alt text-text-muted hover:text-text-main dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  }`}
                  onClick={() => setTab(option.key)}
                >
                  {option.label}
                </button>
              ))}

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
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    typeFilter === option.key
                      ? "bg-slate-900 text-white shadow-card dark:bg-slate-100 dark:text-slate-900"
                      : "border border-card-border bg-gradient-to-r from-surface to-surface-alt text-text-muted hover:text-text-main dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400 dark:hover:text-slate-100"
                  }`}
                  onClick={() => setTypeFilter(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 px-5 py-5">
            {filteredNotifications.length > 0 ? (
              <>
                {priorityNotifications.length > 0 ? (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted dark:text-slate-400">
                          Priority inbox
                        </h3>
                        <p className="text-xs text-text-muted dark:text-slate-500">
                          Unread and critical notifications appear here first.
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20">
                        {priorityNotifications.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {priorityNotifications.map((notification) => {
                        const meta = typeMeta[notification.type] || typeMeta.info;
                        return (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            meta={meta}
                            onToggleRead={markNotificationRead}
                            onDismiss={(id) => {
                              deleteNotification(id);
                              toast.success("Notification dismissed");
                            }}
                          />
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {regularNotifications.length > 0 ? (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted dark:text-slate-400">
                          Activity archive
                        </h3>
                        <p className="text-xs text-text-muted dark:text-slate-500">
                          Read items and lower-priority updates live here.
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                        {regularNotifications.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {regularNotifications.map((notification) => {
                        const meta = typeMeta[notification.type] || typeMeta.info;
                        return (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            meta={meta}
                            onToggleRead={markNotificationRead}
                            onDismiss={(id) => {
                              deleteNotification(id);
                              toast.success("Notification dismissed");
                            }}
                          />
                        );
                      })}
                    </div>
                  </section>
                ) : null}
              </>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-card-border bg-gradient-to-br from-surface to-surface-alt px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                  <BellRing className="text-primary" size={28} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-text-main dark:text-slate-100">
                  No notifications found
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-text-muted dark:text-slate-400">
                  Try a different search term or filter, or add a demo alert to test the page actions.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Button onClick={handleSeedDemoAlert}>
                    <Sparkles size={16} />
                    Add demo alert
                  </Button>
                  <Button variant="ghost" onClick={() => setQuery("")}>
                    <X size={16} />
                    Reset search
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-text-main dark:text-slate-100">Quick Actions</h3>
                <p className="mt-1 text-sm text-text-muted dark:text-slate-400">Manage the inbox in one click.</p>
              </div>
              <ShieldAlert className="text-primary" size={20} />
            </div>
            <div className="mt-4 grid gap-3">
              <Button onClick={() => markAllNotificationsRead()}>
                <CheckCheck size={16} />
                Mark all read
              </Button>
              <Button variant="ghost" onClick={handleSeedDemoAlert}>
                <BellRing size={16} />
                Add demo alert
              </Button>
              <Button variant="ghost" onClick={() => clearNotifications()}>
                <Trash2 size={16} />
                Clear notifications
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-base font-semibold text-text-main dark:text-slate-100">Inbox Rules</h3>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="font-semibold text-text-main dark:text-slate-100">Success</p>
                  <p className="text-text-muted dark:text-slate-400">Completed workflows and saved records.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                <div>
                  <p className="font-semibold text-text-main dark:text-slate-100">Warning</p>
                  <p className="text-text-muted dark:text-slate-400">Needs attention, but not blocked yet.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <div>
                  <p className="font-semibold text-text-main dark:text-slate-100">Info</p>
                  <p className="text-text-muted dark:text-slate-400">Routine system updates and activity.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ArrowRight size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-main dark:text-slate-100">Fast review flow</h3>
                <p className="text-sm text-text-muted dark:text-slate-400">
                  Use the inbox filters to narrow the list and handle alerts in batches.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;