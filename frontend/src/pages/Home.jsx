import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { useTracking } from "../hooks/useTracking";
import { products } from "../data/product";

export default function Home() {
  useTracking("Home");

  return (
    <Layout>

      {/* 🔷 HERO */}
      <div className="relative mb-12 p-10 rounded-3xl overflow-hidden text-white shadow-lg
        bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 animate-fadeIn">

        {/* subtle background glow */}
        <div className="absolute w-72 h-72 bg-slate-500 opacity-10 blur-3xl rounded-full top-0 left-0"></div>
        <div className="absolute w-72 h-72 bg-slate-400 opacity-10 blur-3xl rounded-full bottom-0 right-0"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
            Smart Analytics Experience
          </h1>

          <p className="text-slate-300 max-w-xl">
            Explore products while capturing user behavior through a scalable
            event-driven analytics system.
          </p>

          <div className="mt-6 flex gap-4">
            <Link to="/product">
              <button className="bg-white text-black px-6 py-2 rounded-xl font-medium 
                hover:bg-gray-200 transition duration-300">
                Browse Products
              </button>
            </Link>

            <Link to="/dashboard">
              <button className="border border-slate-400 px-6 py-2 rounded-xl 
                hover:bg-white hover:text-black transition duration-300">
                View Analytics
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 🔷 TITLE */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Trending Products</h2>
        <Link to="/dashboard" className="text-gray-600 hover:text-black transition">
          View Insights →
        </Link>
      </div>

      {/* 🔷 PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <div className="group rounded-2xl bg-white p-3 shadow-sm 
              hover:shadow-md transition duration-300 hover:-translate-y-[2px]">

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-72 object-cover rounded-xl"
              />

              <h3 className="font-medium text-lg text-gray-900 mt-4">{product.name}</h3>
              <p className="text-gray-500 text-sm">{product.price}</p>

              <button className="mt-3 w-full bg-black text-white py-2 rounded-lg 
                group-hover:bg-gray-800 transition duration-300">
                View Product
              </button>

            </div>
          </Link>
        ))}

      </div>

      {/* 🔷 FEATURES */}
      <div className="mt-14 grid md:grid-cols-3 gap-6">

        {[
          {
            title: "Real-Time Tracking",
            desc: "Capture user interactions across sessions and pages."
          },
          {
            title: "Behavior Analytics",
            desc: "Understand user journeys through aggregated insights."
          },
          {
            title: "Optimized Performance",
            desc: "Efficient batching ensures scalable event ingestion."
          }
        ].map((item, i) => (
          <div key={i}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md 
            transition duration-300">

            <h3 className="font-medium mb-2 text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}

      </div>

    </Layout>
  );
}