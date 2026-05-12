import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 border-t border-slate-700/60 bg-[#1f2d44] px-6 py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
        <p className="text-[32px] font-semibold leading-tight text-white sm:text-2xl">
          © {year} TSAR IT Electro Shop All rights reserved.
        </p>
        <p className="text-base text-slate-300 sm:text-lg">
           Electronic Management | Professional Service
        </p>
        <Link
          to="/register"
          className="inline-flex min-w-[252px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.4)] transition hover:bg-emerald-600"
        >
          <span aria-hidden="true">🔐</span>
          <span>Register</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;