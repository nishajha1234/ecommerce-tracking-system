import { Link, useLocation } from "react-router-dom";
import { Home, Package, BarChart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItem = (path, label, icon, onClick) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        onClick={onClick}
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
    <div className="bg-gray-100 min-h-screen">
      
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Trackify</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-700"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="absolute inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
        
        <div className="relative w-64 h-full bg-white p-6 flex flex-col justify-between shadow-lg">
          
          <div>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Trackify
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Analytics Platform
                </p>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {navItem("/", "Home", <Home size={18} />, () => setIsOpen(false))}
              {navItem("/product", "Products", <Package size={18} />, () => setIsOpen(false))}
              {navItem("/dashboard", "Dashboard", <BarChart size={18} />, () => setIsOpen(false))}
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Built for analytics
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-sm p-6 flex-col justify-between">
        
        <div>
          <div className="mb-10">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">
              Trackify
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Analytics Platform
            </p>
          </div>

          <div className="space-y-2">
            {navItem("/", "Home", <Home size={18} />)}
            {navItem("/product", "Products", <Package size={18} />)}
            {navItem("/dashboard", "Dashboard", <BarChart size={18} />)}
          </div>
        </div>

        <div className="text-xs text-gray-400">
          Built for analytics
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-4 sm:p-6 md:p-8 animate-fadeIn">
        {children}
      </div>
    </div>
  );
}