import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Search" }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-card-border bg-gradient-to-r from-surface via-surface to-surface-alt px-4 py-2.5 text-sm text-text-muted shadow-soft transition-all duration-200 focus-within:border-primary/30 focus-within:shadow-card dark:bg-surface-alt">
    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Search size={16} />
    </span>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-transparent text-text-main outline-none placeholder:text-text-muted"
    />
  </div>
);

export default SearchInput;
