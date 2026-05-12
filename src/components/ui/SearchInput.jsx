import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Search" }) => (
  <div className="flex items-center gap-2 rounded-xl border border-card-border bg-white px-3 py-2 text-sm text-text-muted shadow-soft">
    <Search size={16} className="text-text-muted" />
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-transparent text-text-main outline-none placeholder:text-text-muted"
    />
  </div>
);

export default SearchInput;
