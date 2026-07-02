import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Search" }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-amber-500/10 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-300 shadow-inner shadow-amber-500/5 transition-all duration-300 focus-within:border-amber-500/30 focus-within:ring-1 focus-within:ring-amber-500/30">
    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
      <Search size={16} />
    </span>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
    />
  </div>
);

export default SearchInput;
