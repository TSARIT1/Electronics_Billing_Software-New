import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  Target,
  Heart,
  Globe,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Inline SVG social icons (not available in lucide-react v1.14+)
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4"/></svg>
);
const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const slides = [
  {
    title: "Refined retail workflow",
    subtitle: "From stock to sales, every step feels polished, precise, and fast.",
    badge: "Luxury-grade UX",
  },
  {
    title: "Instant invoice mastery",
    subtitle: "Create premium receipts, print with confidence, and stay on top of every customer.",
    badge: "Smart billing",
  },
  {
    title: "Real-time inventory clarity",
    subtitle: "Know what moves, what sells, and when to reorder with perfect precision.",
    badge: "Stock visibility",
  },
];

const features = [
  {
    title: "Executive dashboard",
    description: "A clear command center for inventory, billing, and purchase decisions.",
    icon: LayoutDashboard,
  },
  {
    title: "Secure retail access",
    description: "Role-based sessions and protected operations keep data safe.",
    icon: ShieldCheck,
  },
  {
    title: "Team-ready control",
    description: "Invite staff, track activity, and keep your store workflow flowing.",
    icon: Users,
  },
  {
    title: "Faster workflows",
    description: "Intelligent flow design that turns every task into a premium experience.",
    icon: Zap,
  },
];

const fallbackPlans = [
  {
    id: 1,
    name: "Free Plan",
    price: 0,
    durationLabel: "2 days",
    features: "Single Dashboard",
    discount: 0,
  },
  {
    id: 2,
    name: "Silver",
    price: 7000,
    durationLabel: "6 months",
    features: "All Features",
    discount: 30,
  },
  {
    id: 3,
    name: "Platinum",
    price: 21999,
    durationLabel: "12 months",
    features: "All Features,Priority Support,Custom Branding",
    discount: 30,
  },
  {
    id: 4,
    name: "Gold",
    price: 15999,
    durationLabel: "9 months",
    features: "All Features,Priority Support",
    discount: 20,
  },
];

const Landing = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const activeSlideData = slides[activeSlide];

  const [plans, setPlans] = useState(fallbackPlans);

  useEffect(() => {
    fetch("http://127.0.0.1:8081/api/super-admin/plans")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const activePlans = data.filter(p => p.status === "ACTIVE" || !p.status);
          setPlans(activePlans.length > 0 ? activePlans : fallbackPlans);
        } else {
          setPlans(fallbackPlans);
        }
      })
      .catch((err) => {
        console.warn("Using fallback plans because backend server is not available or returned an error:", err);
        setPlans(fallbackPlans);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5200);
    return () => clearInterval(interval);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#020717] text-slate-100">
      <div className="relative overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)]" 
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 sm:px-10">
          <motion.nav 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="sticky top-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-amber-500/20 bg-slate-950/80 px-5 py-4 shadow-[0_0_40px_rgba(245,158,11,0.1)] backdrop-blur-xl z-50"
          >
            <Link to="/" className="flex items-center gap-3 text-white">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444] shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-100">ElectroShop</p>
                <p className="text-xs text-slate-400">Luxury retail platform</p>
              </div>
            </Link>

            <div className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
              <a href="#features" className="transition hover:text-amber-300">Features</a>
              <a href="#showcase" className="transition hover:text-amber-300">Showcase</a>
              <a href="#plans" className="transition hover:text-amber-300">Plans</a>
              <a href="#reviews" className="transition hover:text-amber-300">Reviews</a>
              <a href="#about" className="transition hover:text-amber-300">About</a>
              <a href="#contact" className="transition hover:text-amber-300">Contact</a>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
              >
                Sign Up <ArrowRight size={16} />
              </Link>
            </div>
          </motion.nav>
        </div>

        <main className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-8 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-[32px] border border-amber-500/20 bg-slate-950/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
            >
              <motion.span 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] border border-amber-500/20"
              >
                <Sparkles className="h-4 w-4" />
                Luxury retail software
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mt-8 text-5xl font-light tracking-tight text-white sm:text-6xl leading-[1.1]"
              >
                Turn inventory into a <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">premium retail</span> experience.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl font-light"
              >
                ElectroShop crafts a high-end operations workspace that looks beautiful, feels effortless, and moves your store forward with unparalleled elegance.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-10 rounded-[28px] border border-amber-500/15 bg-slate-900/80 p-6 shadow-inner shadow-amber-500/5 backdrop-blur-md"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Featured experience</p>
                <p className="mt-3 text-xl font-semibold text-white">{activeSlideData.title}</p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{activeSlideData.subtitle}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-200">
                    {activeSlideData.badge}
                  </span>
                  <div className="flex items-center gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${
                          index === activeSlide ? "bg-amber-300" : "bg-slate-600"
                        }`}
                        aria-label={`Slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ef4444] px-8 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(245,158,11,0.4)] transition duration-300 hover:shadow-[0_0_50px_rgba(245,158,11,0.6)]"
                  >
                    Secure login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl border border-amber-500/30 bg-slate-900/80 px-8 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-md transition duration-300 hover:bg-white/10"
                  >
                    Create account
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                { title: "4.9/5", description: "Retail teams love the premium workflow.", index: 0 },
                { title: "+50%", description: "Faster billing and checkout speed.", index: 1 },
                { title: "Real-time", description: "Inventory visibility across every product.", index: 2 },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + item.index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative overflow-hidden rounded-[28px] border border-amber-500/20 bg-slate-900/95 px-6 py-6 shadow-2xl backdrop-blur-lg group"
                >
                  <div className="absolute -inset-x-4 -inset-y-4 z-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition duration-1000 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <p className="text-3xl font-semibold text-white group-hover:text-amber-400 transition-colors">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Inventory view", caption: "Stock, alerts, and replenishment of premium devices.", src: "/landing_inventory.png", delay: 0.2 },
                { label: "Billing studio", caption: "Invoice creation and checkout flow with luxury polish.", src: "/landing_billing.png", delay: 0.4 },
                { label: "Insight panel", caption: "Sales and electronics performance in one glowing glance.", src: "/landing_insights.png", delay: 0.6 },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="group overflow-hidden rounded-[28px] border border-amber-500/20 bg-slate-900/95 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-lg transition-all hover:border-amber-400/50 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)]"
                >
                  <div className="overflow-hidden h-44">
                    <img src={item.src} alt={item.label} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="space-y-2 px-4 py-4 text-sm text-slate-200">
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="text-slate-300">{item.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="overflow-hidden rounded-[36px] border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.2)] backdrop-blur-xl"
          >
            <div className="relative h-full min-h-[500px] sm:min-h-[640px] bg-slate-950 overflow-hidden">
              <motion.img
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                src="/landing_hero.png"
                alt="Premium electronics workspace visuals"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
            </div>
          </motion.div>
        </main>

        {/* Brand Marquee Section */}
        <section className="relative mx-auto max-w-7xl px-6 pb-24 sm:px-10">
          <div className="flex flex-col items-center border-y border-amber-500/10 py-10">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-8 font-semibold">Trusted by Premium Electronics Retailers</p>
            <div className="w-full overflow-hidden relative flex mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)">
              {/* Left/Right Fades for Marquee */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#020717] to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#020717] to-transparent z-10" />
              
              <motion.div
                animate={{ x: [0, -1035] }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="flex items-center gap-16 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-500"
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-6 sm:gap-10">
                    {[
                      { name: "Samsung", url: "https://cdn.simpleicons.org/samsung/fff" },
                      { name: "Sony", url: "https://cdn.simpleicons.org/sony/fff" },
                      { name: "Apple", url: "https://cdn.simpleicons.org/apple/fff", pb: "pb-1" },
                      { name: "LG", url: "https://cdn.simpleicons.org/lg/fff" },
                      { name: "Panasonic", url: "https://cdn.simpleicons.org/panasonic/fff" },
                      { name: "Dell", url: "https://cdn.simpleicons.org/dell/fff" }
                    ].map((brand, idx) => (
                      <div key={idx} className="group relative flex h-20 w-32 sm:h-24 sm:w-40 flex-shrink-0 items-center justify-center rounded-2xl border border-amber-500/10 bg-slate-900/40 shadow-inner shadow-amber-500/5 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:bg-slate-800/80 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <img 
                          src={brand.url} 
                          alt={brand.name} 
                          className={`relative z-10 h-8 sm:h-12 w-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-110 px-4 ${brand.pb || ''}`} 
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 pb-20 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Feature spotlight</p>
              <h2 className="text-4xl font-semibold text-white sm:text-5xl">A luxury workspace for premium retail operations.</h2>
              <p className="max-w-xl text-base leading-8 text-slate-300">
                Crafted to make inventory, billing, and purchase management feel polished, premium, and effortless.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -6 }}
                    className="rounded-[28px] border border-amber-500/20 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-lg transition"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/15 text-amber-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="showcase" className="mx-auto max-w-7xl px-6 pb-20 sm:px-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { title: "Premium visuals", subtitle: "Layered gradients, crisp imagery, and modern commerce design." },
              { title: "Design-driven flow", subtitle: "Every block supports clarity and conversion for retail teams." },
              { title: "Built for retail", subtitle: "A high-value presentation perfect for store operations." },
            ].map((item) => (
              <div key={item.title} className="rounded-[32px] border border-amber-500/20 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300">{item.title}</p>
                <p className="mt-4 text-base leading-7 text-slate-300">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing/Plans Section */}
        <section id="plans" className="mx-auto max-w-7xl px-6 pb-24 sm:px-10">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">Pricing plans</p>
            <h2 className="text-4xl font-semibold text-white sm:text-5xl max-w-3xl mx-auto">
              Choose the perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">growth plan</span> for your store
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-base leading-8 text-slate-300 font-light">
              Unlock the full potential of ElectroShop. Scale operations, manage teams, and speed up checkouts with flexible tiers.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, idx) => {
              const featuresList = plan.features ? plan.features.split(",") : [];
              const hasDiscount = plan.discount > 0;
              const finalPrice = plan.price;
              const originalPrice = hasDiscount 
                ? Math.round(plan.price / (1 - plan.discount / 100))
                : plan.price;

              return (
                <motion.div
                  key={plan.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-[32px] border bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(245,158,11,0.1)] ${
                    plan.name.toLowerCase() === "gold" || plan.name.toLowerCase() === "platinum"
                      ? "border-amber-500/40 hover:border-amber-400"
                      : "border-amber-500/10 hover:border-amber-500/30"
                  }`}
                >
                  {hasDiscount && (
                    <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-[#f59e0b] to-[#ef4444] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {plan.discount}% Off
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-4">
                      {plan.price === 0 ? (
                        <span className="text-4xl font-light tracking-tight text-white">Free</span>
                      ) : (
                        <>
                          {hasDiscount && (
                            <span className="text-sm text-slate-500 line-through mr-1">
                              ₹{originalPrice}
                            </span>
                          )}
                          <span className="text-4xl font-semibold text-white">
                            ₹{finalPrice}
                          </span>
                        </>
                      )}
                      <span className="text-xs text-slate-400 ml-1">/{plan.durationLabel}</span>
                    </div>

                    <ul className="mt-8 space-y-4">
                      {featuresList.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span>{feat.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      to="/register"
                      className={`inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                        plan.name.toLowerCase() === "gold" || plan.name.toLowerCase() === "platinum"
                          ? "bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-110"
                          : "border border-amber-500/20 bg-slate-900/60 text-amber-300 hover:bg-slate-900 hover:border-amber-500/40"
                      }`}
                    >
                      Choose Plan
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-7xl px-6 pb-24 sm:px-10">
          <div className="rounded-[36px] border border-amber-500/20 bg-slate-950/95 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">What customers love</p>
                <h2 className="text-4xl font-semibold text-white">Retail leaders call it polished, powerful, and effortless.</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-[28px] border border-amber-500/20 bg-slate-950/95 p-6">
                  <p className="text-sm text-slate-300">"ElectroShop turned our billing into a premium experience instead of another spreadsheet."</p>
                  <p className="mt-4 text-sm font-semibold text-white">— Priya S., Store Manager</p>
                </div>
                <div className="rounded-[28px] border border-amber-500/20 bg-slate-950/95 p-6">
                  <p className="text-sm text-slate-300">"The visuals and workflow are exactly what our retail team needed."</p>
                  <p className="mt-4 text-sm font-semibold text-white">— Malik H., Retail Operations</p>
                </div>
              </div>
              <div className="rounded-[28px] border border-amber-500/20 bg-slate-950/95 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Metrics</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "+48%", text: "Faster billing" },
                    { label: "4.9/5", text: "User satisfaction" },
                    { label: "Instant", text: "Receipt creation" },
                    { label: "All-in-one", text: "Inventory + purchases" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl bg-slate-900/95 p-4">
                      <p className="text-2xl font-semibold text-white">{item.label}</p>
                      <p className="mt-2 text-sm text-slate-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ ABOUT US SECTION ═══════════════════ */}
        <section id="about" className="relative mx-auto max-w-7xl px-6 pb-24 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">About us</p>
              <h2 className="text-4xl font-semibold text-white sm:text-5xl max-w-3xl mx-auto">
                Crafting the future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">premium retail</span> technology
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-base leading-8 text-slate-300 font-light">
                ElectroShop is a product of <span className="font-semibold text-amber-300">TsarIT Pvt.Ltd.</span> — born from a simple belief that retail operations deserve the same level of sophistication and beauty as the products they sell.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mb-12">
              {[
                {
                  icon: Target,
                  title: "Our Mission",
                  description: "To empower electronics retailers with a world-class platform that transforms everyday operations into seamless, elegant experiences — making inventory, billing, and analytics feel effortless.",
                },
                {
                  icon: Heart,
                  title: "Our Values",
                  description: "We believe in precision, beauty, and reliability. Every pixel is intentional, every workflow tested. We craft software that retail teams genuinely love to use every single day.",
                },
                {
                  icon: Globe,
                  title: "Our Vision",
                  description: "To become the gold standard for retail management globally — a platform so intuitive and polished that it redefines how the world thinks about store operations software.",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                    whileHover={{ y: -8 }}
                    className="group rounded-[32px] border border-amber-500/20 bg-slate-950/95 p-8 shadow-2xl backdrop-blur-lg transition-all hover:border-amber-400/40 hover:shadow-[0_20px_50px_rgba(245,158,11,0.1)]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/15 text-amber-300 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats row */}
            <div className="rounded-[36px] border border-amber-500/20 bg-slate-950/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
                {[
                  { value: "500+", label: "Retail stores powered" },
                  { value: "2M+", label: "Invoices generated" },
                  { value: "99.9%", label: "Uptime reliability" },
                  { value: "24/7", label: "Dedicated support" },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="space-y-2"
                  >
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{stat.value}</p>
                    <p className="text-sm text-slate-400 uppercase tracking-[0.15em]">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════ CONTACT US SECTION ═══════════════════ */}
        <section id="contact" className="relative mx-auto max-w-7xl px-6 pb-24 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">Get in touch</p>
              <h2 className="text-4xl font-semibold text-white sm:text-5xl max-w-3xl mx-auto">
                Let's start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">conversation</span>
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-base leading-8 text-slate-300 font-light">
                Whether you have a question, want a demo, or are ready to upgrade your retail workflow — we'd love to hear from you.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              {/* Contact info cards */}
              <div className="space-y-5">
                {[
                  { icon: Mail, title: "Email Us", detail: "Info@tsaritservices.com", subtitle: "We reply within 24 hours" },
                  { icon: Phone, title: "Call Us", detail: "+91 9491301258", subtitle: "Mon–Sat, 9 AM – 7 PM IST" },
                  { icon: Phone, title: "Alternate Number", detail: "+91 8142616767", subtitle: "Mon–Sat, 9 AM – 7 PM IST" },
                  { icon: MapPin, title: "Visit Us", detail: "Punganur, Madanapalle, Chittoor - 517247", subtitle: "Andhra Pradesh" },
                  { icon: Clock, title: "Business Hours", detail: "Mon – Sat: 9 AM – 7 PM", subtitle: "Sunday: Closed" },
                ].map((info, idx) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ x: 6 }}
                      className="group flex items-start gap-5 rounded-[24px] border border-amber-500/15 bg-slate-950/95 p-6 shadow-xl backdrop-blur-lg transition-all hover:border-amber-400/30 hover:shadow-[0_10px_30px_rgba(245,158,11,0.08)]"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/15 text-amber-300 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{info.title}</p>
                        <p className="mt-1 text-base text-amber-200/90">{info.detail}</p>
                        <p className="mt-1 text-xs text-slate-400">{info.subtitle}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Contact form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-[32px] border border-amber-500/20 bg-slate-950/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
              >
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-5"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/15 text-emerald-400">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Message sent!</h3>
                    <p className="text-sm text-slate-300 max-w-sm">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Full Name</label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/50 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Email</label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/50 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Subject</label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="How can we help?"
                        className="w-full rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/50 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Message</label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Tell us about your retail needs..."
                        className="w-full resize-none rounded-2xl border border-amber-500/15 bg-slate-900/80 px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-400/50 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#ef4444] px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(245,158,11,0.3)] transition duration-300 hover:shadow-[0_0_50px_rgba(245,158,11,0.5)]"
                    >
                      <Send className="h-4 w-4" /> Send Message
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer className="relative border-t border-amber-500/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
              {/* Brand column */}
              <div className="space-y-5">
                <Link to="/landing" className="flex items-center gap-3 text-white">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444] shadow-glow">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-100">ElectroShop</p>
                    <p className="text-xs text-slate-400">Luxury retail platform</p>
                  </div>
                </Link>
                <p className="text-sm leading-7 text-slate-400 max-w-xs">
                  The premium operations platform for modern electronics retailers. Beautiful, powerful, and effortlessly elegant.
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { name: "Twitter", icon: TwitterIcon, href: "https://twitter.com" },
                    { name: "LinkedIn", icon: LinkedinIcon, href: "https://linkedin.com" },
                    { name: "GitHub", icon: GithubIcon, href: "https://github.com" },
                    { name: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
                  ].map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3, scale: 1.1 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/15 bg-slate-900/60 text-slate-400 transition hover:border-amber-400/30 hover:text-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        aria-label={social.name}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold mb-5">Quick Links</p>
                <ul className="space-y-3">
                  {[
                    { label: "Features", href: "#features" },
                    { label: "Showcase", href: "#showcase" },
                    { label: "Plans", href: "#plans" },
                    { label: "Reviews", href: "#reviews" },
                    { label: "About Us", href: "#about" },
                    { label: "Contact", href: "#contact" },
                  ].map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-slate-400 transition hover:text-amber-300 hover:translate-x-1 inline-block">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Platform */}
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold mb-5">Platform</p>
                <ul className="space-y-3">
                  {[
                    { label: "Dashboard", to: "/login" },
                    { label: "Inventory", to: "/login" },
                    { label: "Billing", to: "/login" },
                    { label: "Reports", to: "/login" },
                    { label: "User Management", to: "/login" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-sm text-slate-400 transition hover:text-amber-300 hover:translate-x-1 inline-block">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact info */}
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold mb-5">Reach Us</p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-400">Info@tsaritservices.com</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-400">+91 9491301258</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-400">+91 8142616767</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-400">Punganur, Madanapalle, Chittoor - 517247,<br />Andhra Pradesh</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-amber-500/10 pt-8 sm:flex-row">
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} ElectroShop. All rights reserved. Crafted with precision.
              </p>
              <div className="flex items-center gap-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/super-admin-login"
                    id="footer-super-admin-btn"
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.08)] transition-all hover:border-amber-400/40 hover:text-amber-200 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Super Admin
                  </Link>
                </motion.div>
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <a key={item} href="#" className="text-xs text-slate-500 transition hover:text-amber-300">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
