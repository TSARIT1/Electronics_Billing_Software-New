const Card = ({ className = "", children }) => (
  <div
    className={`rounded-[28px] border border-amber-500/10 bg-slate-950/50 backdrop-blur-xl shadow-[0_0_40px_rgba(245,158,11,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] hover:border-amber-500/20 ${className}`}
  >
    {children}
  </div>
);

export default Card;
