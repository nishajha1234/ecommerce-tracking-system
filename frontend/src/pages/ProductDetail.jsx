import Layout from "../components/Layout";
import { useTracking } from "../hooks/useTracking";
import { pushEvent } from "../utils/eventQueue";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { products } from "../data/product";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(p => p.id.toString() === id);

  useTracking("Product_Detail");

  useEffect(() => {
    if (!product) return;

    const sessionId = localStorage.getItem("sessionId");

    pushEvent({
      eventType: "PRODUCT_VIEW",
      productId: product.id.toString(),
      page: `/product/${product.id}`,
      sessionId
    });
  }, [product]);

  if (!product) {
    return <Layout><p className="p-6">Product not found</p></Layout>;
  }

  return (
    <Layout>

      <div className="animate-fadeIn max-w-6xl mx-auto">

        <div className="max-w-6xl mx-auto mb-4">
  <button
    onClick={() => navigate(-1)}
    className="text-sm text-gray-500 hover:text-black transition"
  >
    ← Back
  </button>
</div>

        {/* 🔷 MAIN CONTAINER */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8">

          <div className="grid md:grid-cols-2 gap-10 items-start">

            {/* 🔷 IMAGE (PORTRAIT FIXED) */}
            <div className="w-full max-w-sm mx-auto">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            {/* 🔷 INFO */}
            <div className="flex flex-col justify-between h-full">

              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  {product.name}
                </h1>

                <p className="text-gray-500 mt-3 leading-relaxed">
                  {product.desc}
                </p>

                <p className="text-gray-500 mt-3 leading-relaxed">
  {product.details}
</p>

<div className="mt-6">
  <h3 className="text-sm font-medium text-gray-900 mb-2">
    Key Features
  </h3>

  <ul className="space-y-1 text-sm text-gray-500">
    {product.features.map((feature, i) => (
      <li key={i}>• {feature}</li>
    ))}
  </ul>
</div>

                {/* Price */}
                <p className="mt-9 text-2xl font-semibold text-gray-900">
                  {product.price}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* 🔷 EXTRA INFO SECTION (VERY IMPORTANT FOR DEPTH) */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">

          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="font-medium text-gray-900 mb-1">Fast Delivery</h3>
            <p className="text-sm text-gray-500">
              Delivered within 2-4 business days.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="font-medium text-gray-900 mb-1">Warranty</h3>
            <p className="text-sm text-gray-500">
              1 year manufacturer warranty included.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <h3 className="font-medium text-gray-900 mb-1">Secure Payment</h3>
            <p className="text-sm text-gray-500">
              100% secure payment options available.
            </p>
          </div>

        </div>

      </div>

    </Layout>
  );
}