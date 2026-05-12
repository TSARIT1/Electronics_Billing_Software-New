const Card = ({ className = "", children }) => (
  <div
    className={`rounded-2xl border border-card-border bg-white shadow-card ${className}`}
  >
    {children}
  </div>
);

export default Card;
