import useStore from "../store/useStore";

const Storefront = () => {
  const { profile, logout } = useStore();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-amber-500">Storefront</h1>
        <div className="flex gap-4 items-center">
          <p>Welcome, {profile.name}!</p>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-4xl font-semibold mb-4">Discover Amazing Products</h2>
        <p className="text-slate-400">The customer storefront is under construction. Stay tuned!</p>
      </div>
    </div>
  );
};

export default Storefront;
