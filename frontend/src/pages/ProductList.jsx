import Layout from "../components/Layout";
import { useTracking } from "../hooks/useTracking";
import { Link } from "react-router-dom";
import { products } from "../data/product";

export default function Product() {
  useTracking("Product_List");

  return (
    <Layout>

      <div className="mb-8 animate-fadeIn">
        <h1 className="text-2xl font-semibold text-gray-900">
          Products
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore products and analyze user engagement behavior
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map((product, index) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden
transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300
animate-slideUp"
            style={{ animationDelay: `${index * 0.08}s` }}
          >

<div className="aspect-[5/5] w-full overflow-hidden rounded-t-xl">
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
  />
</div>

            <div className="p-5">
              <h2 className="font-medium text-lg text-gray-900">
                {product.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {product.desc}
              </p>

              <p className="mt-3 font-semibold text-gray-900">
                {product.price}
              </p>

              <button
  className="mt-4 w-full bg-black text-white py-2 rounded-lg 
  hover:bg-gray-800 transition duration-300"
>
  View Details
</button>
            </div>

          </Link>
        ))}

      </div>

    </Layout>
  );
}