import { Link, useLocation } from "react-router-dom";
import { Home, Package, BarChart } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  const navItem = (path, label, icon) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-slate-800 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="bg-gray-100">

      {/* 🔷 SIDEBAR (FIXED) */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-sm p-6 flex flex-col justify-between">

        {/* Top */}
        <div>
          {/* 🔥 Branding Upgrade */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">
              Trackify
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Analytics Platform
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            {navItem("/", "Home", <Home size={18} />)}
            {navItem("/product", "Products", <Package size={18} />)}
            {navItem("/dashboard", "Dashboard", <BarChart size={18} />)}
          </div>
        </div>

        {/* Bottom */}
        <div className="text-xs text-gray-400">
          Built for analytics
        </div>
      </div>

      {/* 🔷 MAIN CONTENT (SCROLLABLE) */}
      <div className="ml-64 p-8 min-h-screen animate-fadeIn">
        {children}
      </div>

    </div>
  );
}