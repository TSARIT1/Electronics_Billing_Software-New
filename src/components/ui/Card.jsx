const Card = ({ className = "", children }) => (
  <div
    className={`rounded-2xl border border-card-border bg-surface bg-gradient-to-br from-surface via-surface to-surface-alt shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl dark:bg-surface dark:bg-none dark:shadow-none ${className}`}
  >
    {children}
  </div>
);

export default Card;
