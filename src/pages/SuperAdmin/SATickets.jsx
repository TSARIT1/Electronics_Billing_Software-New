import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TicketCheck, RefreshCw, MessageSquare, X, Circle } from "lucide-react";
import toast from "react-hot-toast";
import { getAllTickets, respondToTicket, getTicketStats } from "../../services/superAdmin";

const priorityColors = {
  HIGH: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
  LOW: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
};

const statusColors = {
  PENDING: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
  RESOLVED: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
};

const SATickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [respondModal, setRespondModal] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [responding, setResponding] = useState(false);

  const fetchData = () => {
    setLoading(true);
    const priority = priorityFilter !== "ALL" ? priorityFilter : null;
    Promise.all([getAllTickets(priority, statusFilter), getTicketStats()])
      .then(([ticketData, statsData]) => {
        setTickets(ticketData);
        setStats(statsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priorityFilter, statusFilter]);

  const handleRespond = async () => {
    if (!responseText.trim()) return;
    setResponding(true);
    try {
      await respondToTicket(respondModal.id, responseText);
      toast.success("Response submitted and ticket resolved successfully!");
      setRespondModal(null);
      setResponseText("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to submit response");
      console.error(err);
    } finally {
      setResponding(false);
    }
  };

  const priorityTabs = ["ALL", "HIGH", "MEDIUM", "LOW"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)]"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Support Tickets
            </h1>
            <p className="mt-1 text-base text-white/70">
              Manage all support tickets from store admins
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Circle size={8} className="fill-amber-400 text-amber-400" />
              Pending: {stats.pending}
            </span>
            <span className="flex items-center gap-1.5">
              <Circle size={8} className="fill-emerald-400 text-emerald-400" />
              Resolved: {stats.resolved}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Priority tabs */}
        <div className="flex gap-1 rounded-xl border border-amber-500/15 bg-slate-950/90 p-1 backdrop-blur-lg">
          {priorityTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setPriorityFilter(tab)}
              className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                priorityFilter === tab
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Status pills */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              setStatusFilter(statusFilter === "PENDING" ? null : "PENDING")
            }
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
              statusFilter === "PENDING"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                : "bg-slate-950/90 text-slate-400 border-amber-500/10 hover:text-white"
            }`}
          >
            <Circle size={6} className="fill-amber-400 text-amber-400" />
            Pending
          </button>
          <button
            onClick={() =>
              setStatusFilter(statusFilter === "RESOLVED" ? null : "RESOLVED")
            }
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
              statusFilter === "RESOLVED"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-slate-950/90 text-slate-400 border-amber-500/10 hover:text-white"
            }`}
          >
            <Circle size={6} className="fill-emerald-400 text-emerald-400" />
            Resolved
          </button>
        </div>

        {/* Refresh */}
        <button
          onClick={fetchData}
          className="ml-auto flex items-center gap-2 rounded-xl border border-amber-500/15 bg-slate-950/90 px-4 py-2 text-xs font-semibold text-slate-400 transition hover:text-white hover:bg-white/5"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="rounded-[28px] border border-amber-500/15 bg-slate-950/90 shadow-2xl backdrop-blur-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-500/10 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  ID
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Admin ID
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Title
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Priority
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Status
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Created
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Response
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                      Loading tickets...
                    </div>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                    <TicketCheck className="mx-auto h-8 w-8 mb-2 text-slate-600" />
                    No tickets found
                  </td>
                </tr>
              ) : (
                tickets.map((ticket, idx) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 text-slate-400">#{ticket.id}</td>
                    <td className="px-4 py-4 text-slate-300">
                      {ticket.adminId}
                    </td>
                    <td className="px-4 py-4 font-medium text-white">
                      {ticket.title}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          priorityColors[ticket.priority] || ""
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          statusColors[ticket.status] || ""
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-400">
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-slate-400 max-w-[200px] truncate">
                      {ticket.response || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          setRespondModal(ticket);
                          setResponseText(ticket.response || "");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/20 transition hover:bg-indigo-500/20"
                      >
                        <MessageSquare size={13} /> Respond
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Respond Modal */}
      <AnimatePresence>
        {respondModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setRespondModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-[28px] border border-amber-500/20 bg-slate-950 p-8 shadow-[0_0_60px_rgba(245,158,11,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  Respond to Ticket #{respondModal.id}
                </h2>
                <button
                  onClick={() => setRespondModal(null)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4 p-4 rounded-2xl border border-white/5 bg-slate-900/50">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                  Title
                </p>
                <p className="text-sm text-white font-medium">
                  {respondModal.title}
                </p>
                <div className="flex gap-3 mt-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      priorityColors[respondModal.priority] || ""
                    }`}
                  >
                    {respondModal.priority}
                  </span>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      statusColors[respondModal.status] || ""
                    }`}
                  >
                    {respondModal.status}
                  </span>
                </div>
              </div>

              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Your Response
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/40"
                placeholder="Type your response..."
              />

              <button
                onClick={handleRespond}
                disabled={responding || !responseText.trim()}
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#ef4444] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(245,158,11,0.3)] transition hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] disabled:opacity-50"
              >
                {responding ? "Sending..." : "Send Response & Resolve"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SATickets;
