import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, IndianRupee, Clock, Calendar, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../../store/useStore";
import { apiClient } from "../../services/api";
import Card from "../../components/ui/Card";

const Subscription = () => {
  const { profile, setProfile } = useStore();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  useEffect(() => {
    // Fetch all active plans
    apiClient.get("/super-admin/plans")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const activePlans = res.data.filter((p) => p.status === "ACTIVE");
          setPlans(activePlans);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch plans", err);
        toast.error("Could not load pricing plans. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (plan) => {
    if (plan.price === 0) {
      toast.error("This is a free plan and cannot be purchased.");
      return;
    }
    
    setPurchasingId(plan.id);
    try {
      // 1. Create Razorpay Order
      const res = await apiClient.post("/payments/create-order", {
        planId: plan.id,
        shopId: profile.shopId,
      });

      const orderData = res.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ElectroShop",
        description: `Upgrade to ${orderData.planName} Plan`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            toast.loading("Verifying transaction...");
            
            // 3. Verify Payment on Backend
            const verifyRes = await apiClient.post("/payments/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              planId: plan.id,
              shopId: profile.shopId,
            });

            toast.dismiss();
            toast.success("Plan updated successfully!");

            // 4. Update state and session storage
            const currentSession = JSON.parse(localStorage.getItem("es_session") || "{}");
            currentSession.planName = verifyRes.data.planName;
            currentSession.subscriptionExpiresAt = verifyRes.data.expiresAt;
            localStorage.setItem("es_session", JSON.stringify(currentSession));

            setProfile({
              ...profile,
              planName: verifyRes.data.planName,
              subscriptionExpiresAt: verifyRes.data.expiresAt,
            });
            
            // Reload window to update whole layout/sidebar state
            setTimeout(() => {
              window.location.reload();
            }, 1000);

          } catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message || "Payment verification failed!");
          }
        },
        prefill: {
          name: profile.name,
          email: profile.email,
          contact: profile.phone || "",
        },
        theme: {
          color: "#f59e0b",
        },
        modal: {
          ondismiss: function () {
            setPurchasingId(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate transaction.");
      setPurchasingId(null);
    }
  };

  // Calculate days remaining
  const daysRemaining = (() => {
    if (!profile.subscriptionExpiresAt) return 0;
    const expiry = new Date(profile.subscriptionExpiresAt);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  })();

  const cardColors = [
    "border-blue-500/20 hover:border-blue-400/40",
    "border-emerald-500/20 hover:border-emerald-400/40",
    "border-purple-500/20 hover:border-purple-400/40",
    "border-amber-500/20 hover:border-amber-400/40",
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Current Subscription Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-slate-950"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950/20 ring-1 ring-slate-950/30 text-slate-950">
              <CreditCard className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-slate-900/80">Current Workspace Plan</p>
              <h1 className="text-3xl font-extrabold tracking-tight mt-1">
                {profile.planName || "Free Plan"}
              </h1>
              <p className="text-sm font-semibold text-slate-900/80 mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {profile.subscriptionExpiresAt ? (
                  <>Expires on: {new Date(profile.subscriptionExpiresAt).toLocaleDateString("en-IN", {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}</>
                ) : (
                  "No Active Subscription Expiry Set"
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-3 bg-slate-950/10 rounded-2xl border border-slate-950/20 p-4">
            <Clock className="h-6 w-6 text-slate-950" />
            <div>
              <p className="text-2xl font-bold tracking-tight">{daysRemaining}</p>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-900/80">Days Remaining</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Plans Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Upgrade Subscription</h2>
          <p className="text-sm text-slate-400">Unlock more limits, priority support, and advanced features instantly</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-[28px] border border-amber-500/10 bg-slate-900/60"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, idx) => {
              const isActive = (profile.planName || "").toLowerCase() === plan.name.toLowerCase();
              const hasDiscount = plan.discount > 0;
              const finalPrice = plan.price;
              const originalPrice = hasDiscount
                ? Math.round(plan.price / (1 - plan.discount / 100))
                : plan.price;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`relative flex flex-col justify-between rounded-[28px] border ${
                    isActive
                      ? "border-amber-500 bg-amber-500/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                      : cardColors[idx % cardColors.length] + " bg-slate-950/90"
                  } p-7 shadow-2xl backdrop-blur-lg transition-all hover:-translate-y-1`}
                >
                  {/* Discount badge */}
                  {hasDiscount && (
                    <div className="absolute top-4 right-4 flex px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider ring-1 ring-emerald-500/30">
                      {plan.discount}% Off
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      {isActive && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2 py-0.5">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-baseline gap-1">
                      {plan.price === 0 ? (
                        <span className="text-3xl font-extrabold text-white">Free</span>
                      ) : (
                        <>
                          <IndianRupee className="h-5 w-5 text-white" />
                          <span className="text-4xl font-extrabold text-white">
                            {Number(finalPrice).toLocaleString("en-IN")}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-slate-500 line-through ml-1.5">
                              ₹{Number(originalPrice).toLocaleString("en-IN")}
                            </span>
                          )}
                        </>
                      )}
                      {plan.durationLabel && (
                        <span className="ml-1 text-sm text-slate-400">
                          /{plan.durationLabel}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    {plan.features && (
                      <div className="mt-6 border-t border-white/5 pt-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 mb-3">
                          Features Included
                        </p>
                        <div className="space-y-2.5">
                          {plan.features.split(",").map((f) => (
                            <div
                              key={f}
                              className="flex items-start gap-2 text-sm text-slate-300"
                            >
                              <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                              <span>{f.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-8">
                    {isActive ? (
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-400 border border-amber-500/20"
                      >
                        <ShieldCheck size={16} /> Currently Active Plan
                      </button>
                    ) : plan.price === 0 ? (
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-500 border border-white/5"
                      >
                        Not Available
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan)}
                        disabled={purchasingId !== null}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:brightness-110 disabled:opacity-50 transition duration-300"
                      >
                        {purchasingId === plan.id ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} /> Upgrade to {plan.name}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;
