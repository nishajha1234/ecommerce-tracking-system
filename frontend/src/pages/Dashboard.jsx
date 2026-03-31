import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import {
  ProductChart,
  PageTimeChart,
  DropOffChart
} from "../components/Charts";
import { products } from "../data/product";
import { motion } from "framer-motion";
import { flushQueue } from "../utils/eventQueue";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const fetchAnalytics = async () => {
    try {
      await flushQueue();

      const res = await axios.get("http://localhost:5000/api/analytics", {
        headers: { "Cache-Control": "no-cache" }
      });

      setData(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchAnalytics();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <Skeleton />;

  const {
    totalEvents = 0,
    topProducts = [],
    allProducts = [],
    pageStats = [],
    dropOff = [],
    insights = {}
  } = data;

  /* ================= PRODUCT DATA ================= */

  const productChartData = topProducts.map((item) => {
    const product = products.find(
      (p) => p.id.toString() === item._id
    );

    return {
      name: product?.name || "Unknown",
      count: item.count
    };
  });

  const allProductTableData = allProducts.map((item) => {
    const product = products.find(
      (p) => p.id.toString() === item._id
    );

    return {
      name: product?.name || "Unknown",
      count: item.count
    };
  });

  /* ================= INSIGHTS ================= */

  const getProductName = (id) => {
    const product = products.find((p) => p.id.toString() === id);
    return product?.name || "N/A";
  };

  const topProduct = getProductName(insights.mostViewedProduct);
  const engagingPage = insights.mostEngagingPage || "N/A";
  const dropPage = insights.highestDropOffPage || "N/A";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Real-time user behavior insights
          </p>
        </div>

        {/* 🔥 INSIGHTS (NEW - HIGH IMPACT) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard
            title="🔥 Most Viewed Product"
            value={topProduct}
          />
          <InsightCard
            title="⏱ Most Engaging Page"
            value={engagingPage}
          />
          <InsightCard
            title="⚠️ Highest Drop-off"
            value={dropPage}
          />
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPI title="Total Events" value={totalEvents} />
          <KPI title="Products Tracked" value={allProducts.length} />
          <KPI title="Pages Tracked" value={pageStats.length} />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Section
            title={
              <div className="flex justify-between items-center">
                <span>Trending Products</span>
                <button
                  onClick={() => setShowAllProducts(true)}
                  className="text-sm text-black hover:text-blue-600 transition"
                >
                  View More →
                </button>
              </div>
            }
          >
            {productChartData.length ? (
              <ProductChart data={productChartData} />
            ) : (
              <Empty text="No product data yet" />
            )}
          </Section>

          <Section title="Page Engagement">
            {pageStats.length ? (
              <PageTimeChart data={pageStats} />
            ) : (
              <Empty text="No page activity yet" />
            )}
          </Section>

        </div>

        {/* DROP OFF */}
        <Section title="Drop-off Analysis">
          {dropOff.length ? (
            <DropOffChart data={dropOff} />
          ) : (
            <Empty text="No drop-off data yet" />
          )}
        </Section>

      </div>

      {showAllProducts && (
        <ProductModal
          data={allProductTableData}
          onClose={() => setShowAllProducts(false)}
        />
      )}

    </Layout>
  );
}

/* ================= UI ================= */

function KPI({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-gradient-to-br from-white to-gray-50 border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold mt-2 text-gray-900">
        {value}
      </h2>
    </motion.div>
  );
}

/* 🔥 NEW COMPONENT */
function InsightCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="bg-white border rounded-2xl p-5 shadow-md"
    >
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="text-lg font-semibold mt-2 text-gray-900">
        {value}
      </h2>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border rounded-2xl p-5 shadow-sm"
    >
      <div className="mb-4 text-sm font-medium text-gray-700">
        {title}
      </div>
      {children}
    </motion.div>
  );
}

/* 🔥 EMPTY STATE */
function Empty({ text }) {
  return (
    <div className="text-center text-gray-400 py-10 text-sm">
      {text}
    </div>
  );
}

function ProductModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">All Products</h2>
          <button onClick={onClose} className="text-gray-500 text-lg">✕</button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="text-left p-2">Product</th>
                <th className="text-left p-2">Views</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 animate-pulse space-y-6">
        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-3 gap-6">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    </Layout>
  );
}